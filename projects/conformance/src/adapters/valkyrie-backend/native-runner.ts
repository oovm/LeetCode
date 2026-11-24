/**
 * `native` lane 的真实机器码执行。
 *
 * 产物是 `legion build --target node` 生成的 Node-API 原生 addon（x86-64 冻结集），
 * 每个 `<slug>.cases.ts` 用例在独立 Node 子进程里 `require` addon、调用
 * `metadata.invoke.valkyrie` 对应的导出，取 JSON 返回值并比对。
 *
 * 原生 ABI 承载 `i64`（JS `bigint`）、布尔、`utf8` 文本与 `[i64]` 整数数组：数组按
 * 元素编组、调用后写回，因此原地修改语义可以如实比对。实参与返回的载体口径由
 * 执行清单的导出签名决定（`i64` 数字字符串按 bigint 送、`utf8` 数字字符串按文本送），
 * 不凭值形状猜测。`i64` 实参与返回值共用 bigint 载体，53 位以上整数不经过 JS
 * `number`，可以与精确十进制期望逐位比较。
 *
 * 执行前先校验产物、ABI、签名完整性、形参名与实参数量：缺签名 / 非 `node-api` /
 * 形参名与载体不等长 / 找不到声明产物时整体阻塞（不是跳例）；签名完整但某条用例
 * 的载体或字段绑定不匹配时该例记 `skipped`，绝不猜值或伪造通过。子进程还会在
 * 投影返回值前断言实际宿主类型（`i64` 必须 bigint、`utf8` 必须 string 等），
 * 不符按 runner-error 结构化记录，而不是断言失败。
 *
 * 模块与导出身份取自执行清单的正式读取接口（`@nyar/valkyrie` 的
 * `readExecutionManifest`，Rust 侧 `execution::read_manifest`），不扫描目录、
 * 不复用 Wasm 导出名规则猜入口，也不在 TS 侧正则解析清单文本。
 *
 * guest 异常按四类结构化记录：宿主参数错误（addon 抛 `TypeError` / `RangeError`）、
 * guest 失败（guest 抛错经 glue 变成 Node 异常）、运行器错误（缺导出 / 启动失败 /
 * 未预期退出码）、进程崩溃（信号或 NTSTATUS 崩溃码）。当前 guest panic 多表现为
 * 进程崩溃，不冒充可通过的 `Error:` 期望。
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readExecutionManifest } from '@nyar/valkyrie';

import { compareModeForExecution, resultsMatch } from '../../domain/compare-mode.ts';
import {
    I64_MAX,
    I64_MIN,
    isIntegerLiteralString,
    parseIntegerLiteral,
} from '../../domain/integer-literal.ts';
import { problemIdFromDir } from '../../domain/metadata.ts';
import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import {
    loadMetadata,
    loadTestCases,
    requireValkyrieInvokeEntry,
    type TestCase,
} from '../valkyrie-node/ref.ts';

/**
 * 原生调用失败的四个结构化类别。
 *
 * - `host-argument-error`：addon 在编组阶段拒绝实参（`TypeError` / `RangeError`）；
 * - `guest-failure`：guest 抛错经 glue 还原成 Node 异常；
 * - `runner-error`：运行器自身或 addon 装载/导出身份问题；
 * - `process-crash`：guest panic 等导致子进程被信号或 NTSTATUS 崩溃码终止。
 */
export type NativeFailureKind = 'host-argument-error' | 'guest-failure' | 'runner-error' | 'process-crash';

export type NativeRunOutcome = {
    ok: boolean;
    error: string | null;
    /** 首个用例的真实启动命令，供报告记录“命令 + 退出码”。 */
    command: string | null;
    exitStatus: number | null;
    /** 本次失败的结构化类别；成功或仅断言不符时为 `null`。 */
    failureKind: NativeFailureKind | null;
    caseStats: SolverCaseStats;
};

/** 原生 addon 产物身份：模块（`.node` 路径）与清单声明的导出名。 */
export type NativeArtifact = {
    /** 执行清单 `library_exports` 指向的物理产物（`.node`）。 */
    addonPath: string;
    /** 清单声明的导出名（`logical_name`，即宿主可调用的 JS 名）。 */
    exports: string[];
    /** 执行清单的产物种类（本 lane 只接受 `library`）。 */
    artifactKind: string;
    /**
     * 每个公开名的载体签名（来自执行清单）。`parameters` 按形参顺序给出
     * `i64` / `i64[]` / `utf8`，`parameterNames` 给出可绑定的声明名，`returns`
     * 给出返回载体；签名不完整的产物已被 `resolveNativeArtifact` 阻塞，
     * 消费侧不凭值形状猜测（数字字符串属于文本还是整数由这里决定）。
     */
    signatures: Record<string, NativeExportSignature>;
};

/**
 * 清单声明的一条导出载体签名。
 *
 * 签名必须完整：`parameters` 与 `parameterNames` 等长，`returns` 非空。
 * 用例实参按 `parameterNames` 绑定，不依赖 JSON 对象键序；未冻结签名的产物
 * 一律阻塞，不按值形状猜测。
 */
export type NativeExportSignature = {
    parameters: string[];
    parameterNames: string[];
    returns: string;
};

type ManifestLibraryExportEntry = {
    logical_name: string;
    physical_artifact: string;
    abi?: string;
    signature_available?: boolean;
    parameters?: string[];
    parameter_names?: string[];
    returns?: string;
};

/**
 * 校验并投影清单导出表：本 lane 只接受完整的载体合同。
 *
 * 任一条目不满足以下事实即整体阻塞（返回 `null`），不做部分降级：
 * - ABI 必须是 `node-api`；
 * - `signature_available` 必须为真，`returns` 非空；
 * - `parameters` 与 `parameter_names` 等长、名字非空且唯一；
 * - 所有导出指向同一个 `.node` 物理产物，公开名不重复。
 *
 * 导出供测试直接验证反例（缺签名 / 未知载体 / 参数名缺失）。
 */
export function parseNativeManifestExports(
    entries: ManifestLibraryExportEntry[],
): { exports: string[]; signatures: Record<string, NativeExportSignature>; physicalArtifact: string } | null {
    if (!Array.isArray(entries) || entries.length === 0) {
        return null;
    }
    const signatures: Record<string, NativeExportSignature> = {};
    const names: string[] = [];
    let physicalArtifact: string | null = null;
    for (const entry of entries) {
        if (entry.abi !== 'node-api' || entry.signature_available !== true) {
            return null;
        }
        const logicalName = typeof entry.logical_name === 'string' ? entry.logical_name : '';
        const artifact = typeof entry.physical_artifact === 'string' ? entry.physical_artifact : '';
        const parameters = Array.isArray(entry.parameters) ? entry.parameters : [];
        const parameterNames = Array.isArray(entry.parameter_names) ? entry.parameter_names : [];
        const returns = typeof entry.returns === 'string' ? entry.returns : '';
        if (logicalName.length === 0 || artifact.length === 0 || returns.length === 0) {
            return null;
        }
        if (parameters.length !== parameterNames.length) {
            return null;
        }
        if (parameterNames.some((name) => typeof name !== 'string' || name.length === 0)) {
            return null;
        }
        if (new Set(parameterNames).size !== parameterNames.length) {
            return null;
        }
        if (Object.prototype.hasOwnProperty.call(signatures, logicalName)) {
            return null;
        }
        if (physicalArtifact !== null && physicalArtifact !== artifact) {
            return null;
        }
        physicalArtifact = artifact;
        signatures[logicalName] = { parameters, parameterNames, returns };
        names.push(logicalName);
    }
    if (physicalArtifact === null || !physicalArtifact.endsWith('.node')) {
        return null;
    }
    return { exports: names, signatures, physicalArtifact };
}

/**
 * 从执行清单读取模块与导出。
 *
 * 原生 lane 不再扫描目录里的 `.node`，也不复用 Wasm 导出名规则猜入口：
 * 清单的 `library_exports` 是编译产物对宿主承诺的唯一导出表，物理模块由
 * `physical_artifact` 指定。读取走 `@nyar/valkyrie` 的类型化接口
 * （Rust `execution::read_manifest` 的权威投影），不在 TS 侧重写清单格式。
 *
 * 清单缺失、产物种类不是 `library`、导出表不满足完整载体合同（ABI / 签名 /
 * 形参名 / 物理产物）或声明的模块不存在，一律返回 `null`（结构化阻塞）。
 */
export function resolveNativeArtifact(artifactDir: string): NativeArtifact | null {
    let manifest: ReturnType<typeof readExecutionManifest>;
    try {
        manifest = readExecutionManifest(artifactDir);
    }
    catch {
        return null;
    }
    if (manifest === null || manifest.artifact_kind !== 'library') {
        return null;
    }
    const parsed = parseNativeManifestExports(manifest.library_exports as ManifestLibraryExportEntry[]);
    if (parsed === null) {
        return null;
    }
    const addonPath = join(artifactDir, parsed.physicalArtifact);
    if (!existsSync(addonPath)) {
        return null;
    }
    return {
        addonPath,
        exports: parsed.exports,
        artifactKind: manifest.artifact_kind,
        signatures: parsed.signatures,
    };
}

/**
 * 按清单冻结的形参声明名绑定用例实参。
 *
 * 要求键集合与声明名集合完全一致（数量相等、每个声明名都存在），返回按
 * 声明顺序排列的实参。返回 `null` 表示用例字段与签名不匹配，调用方必须
 * 阻塞而不是退回对象键序。
 */
export function bindNativeArguments(args: unknown, parameterNames: string[]): unknown[] | null {
    if (args === null || typeof args !== 'object' || Array.isArray(args)) {
        return null;
    }
    const record = args as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length !== parameterNames.length) {
        return null;
    }
    const bound: unknown[] = [];
    for (const name of parameterNames) {
        if (!Object.prototype.hasOwnProperty.call(record, name)) {
            return null;
        }
        bound.push(record[name]);
    }
    return bound;
}

/**
 * 按清单导出表确定本次调用的导出名（严格消费）。
 *
 * 题目声明的逻辑入口（`metadata.invoke.valkyrie`）必须与清单 `logical_name`
 * （目标公开名，由编译器的目标命名合同投影）**逐字精确匹配且唯一**：
 * - 不做任何大小写/符号启发式换算；
 * - 没有「清单只有一个导出就直接调用」的回退——单导出但入口写错同样失败，
 *   防止把错误的导出跑绿（假绿）；
 * - 清单内重复声明同一公开名也视为合同破坏。
 *
 * 导出供测试直接验证反例。
 */
export function resolveManifestExportName(available: string[], invoke: unknown): string {
    const entry = requireValkyrieInvokeEntry(invoke);
    const matched = available.filter((name) => name === entry);
    if (matched.length === 1) {
        return matched[0]!;
    }
    const reason = matched.length === 0 ? '没有导出与逻辑入口匹配' : '清单重复声明同一公开名';
    throw new Error(`产物清单导出表 (${available.join(', ') || '空'}) 与逻辑入口 ${entry} 不满足唯一匹配：${reason}`);
}

const CASE_TIMEOUT_MILLISECONDS = 30_000;
/** 单例子进程 stdout 上限：大数组返回（如 `gray-code` n=16）的 JSON 会远超默认 1 MiB。 */
const CASE_MAX_BUFFER_BYTES = 64 * 1024 * 1024;

/** 没有可执行期望的哨兵语料。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

/**
 * 子进程脚本：加载 addon、按导出名调用、先断言返回载体、再把返回值编码成
 * `{ value }`。
 *
 * 退出码约定：3 = 缺少导出（runner-error）；4 = 调用抛错；5 = 返回值不符合
 * 清单冻结的返回载体（runner-error，载体合同破坏而不是断言失败）。抛错时 stdout
 * 输出 `{ __nativeError: { kind, name, message } }`：`TypeError` / `RangeError`
 * 归为 `host-argument-error`（addon 编组阶段拒绝实参），其余归为 `guest-failure`
 * （guest 抛错经 glue 变成 Node 异常）。`bigint` 用 `{ __bigint }` 编码，
 * 避免 JSON 丢精度。
 */
const NATIVE_CASE_SCRIPT = `
const addon = process.argv[1];
const exportName = process.argv[2];
const returnKind = process.argv[4];
const module = require(addon);
const fn = module[exportName];
if (typeof fn !== 'function') {
    process.stderr.write('native addon 缺少导出 ' + exportName);
    process.exit(3);
}
const args = JSON.parse(process.argv[3], (_key, value) =>
    value !== null && typeof value === 'object' && typeof value.__bigint === 'string' ? BigInt(value.__bigint) : value);
let result;
try {
    result = fn(...args);
}
catch (error) {
    const kind = error instanceof TypeError || error instanceof RangeError ? 'host-argument-error' : 'guest-failure';
    process.stdout.write(JSON.stringify({
        __nativeError: {
            kind,
            name: error && error.name ? String(error.name) : 'Error',
            message: error && error.message ? String(error.message) : String(error),
        },
    }));
    process.exit(4);
}
const actualType = (value) => value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
const returnTypeError = (expected, actual) => {
    process.stdout.write(JSON.stringify({ __nativeReturnTypeError: { expected, actual } }));
    process.exit(5);
};
if (returnKind === 'i64' && typeof result !== 'bigint') returnTypeError('bigint', actualType(result));
if (returnKind === 'utf8' && typeof result !== 'string') returnTypeError('string', actualType(result));
if (returnKind === 'bool' && typeof result !== 'boolean') returnTypeError('boolean', actualType(result));
if (returnKind === 'i64[]' && !(Array.isArray(result) && result.every((element) => typeof element === 'bigint'))) {
    returnTypeError('bigint[]', actualType(result));
}
if (returnKind === 'unit' && result !== undefined) returnTypeError('undefined', actualType(result));
// 原生导出以 unit 表示「原地修改实参」：单个数组实参时把调用后的数组作为结果，
// 让题库能比较原地修改的语义，而不是把 undefined 当成返回值。
const value = result === undefined
    ? (args.length === 1 && Array.isArray(args[0]) ? args[0] : null)
    : result;
process.stdout.write(JSON.stringify({ value }, (_key, value) =>
    typeof value === 'bigint' ? { __bigint: value.toString() } : value));
`;

/** 实参的 JSON 编码：`i64` 统一走 `{ __bigint }`，子进程按 reviver 还原成 BigInt。 */
type NativeBigIntArgument = { __bigint: string };
type NativeArgument = NativeBigIntArgument | boolean | string | NativeBigIntArgument[];

/**
 * 能被当前 Node-API 原生 addon 承载的实参，按清单冻结的形参载体编组。
 *
 * 生成的参数桥接受 JS `bigint`（`napi_get_value_bigint_int64` + `lossless`）、
 * 布尔、`utf8` 文本（UTF-8 字节复制）与整数数组（`[i64]` 按元素编组并写回）。
 * **数字字符串的归属由清单签名决定**：`i64` 形参按十进制解析成 BigInt（>2^53
 * 也逐位精确），`utf8` 形参原样作为文本；未知载体一律拒绝，绝不凭值形状猜测。
 */
function nativeArgument(value: unknown, kind: string): NativeArgument | null {
    if (kind === 'utf8') {
        return typeof value === 'string' ? value : null;
    }
    if (kind === 'i64') {
        return nativeInteger(value);
    }
    if (kind === 'bool') {
        return typeof value === 'boolean' ? value : null;
    }
    if (kind === 'i64[]') {
        return nativeIntegerArray(value);
    }
    return null;
}

/** 整数数组实参：逐元素按 i64 域编码；任一元素不是整数即整例跳过。 */
function nativeIntegerArray(value: unknown): NativeBigIntArgument[] | null {
    if (!Array.isArray(value)) {
        return null;
    }
    const elements: NativeBigIntArgument[] = [];
    for (const element of value) {
        const encoded = nativeInteger(element);
        if (encoded === null) {
            return null;
        }
        elements.push(encoded);
    }
    return elements;
}

/** 按冻结的整数载体编码实参：安全整数、bigint 或十进制整数字面量；其他返回 `null`。 */
function nativeInteger(value: unknown): NativeBigIntArgument | null {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? { __bigint: String(value) } : null;
    }
    if (typeof value === 'bigint') {
        return value >= I64_MIN && value <= I64_MAX ? { __bigint: value.toString() } : null;
    }
    if (typeof value === 'string') {
        const parsed = parseIntegerLiteral(value);
        return parsed !== null && parsed >= I64_MIN && parsed <= I64_MAX ? { __bigint: parsed.toString() } : null;
    }
    return null;
}

/** 可作为整数结果比较的期望形态：数值、bigint 或十进制整数字面量。 */
function isIntegerExpectation(value: unknown): boolean {
    return typeof value === 'number' || typeof value === 'bigint' || isIntegerLiteralString(value);
}

/** 把期望侧的整数形态解析为 `bigint`；非整数或越界返回 `null`（不静默截断）。 */
function expectedInteger(value: unknown): bigint | null {
    if (typeof value === 'bigint') {
        return value;
    }
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? BigInt(value) : null;
    }
    if (typeof value === 'string') {
        return parseIntegerLiteral(value);
    }
    return null;
}

/** 可比较的期望：严格按冻结返回载体判定，未知载体不设可执行期望。 */
function isExecutableExpectation(expected: unknown, returnKind: string): boolean {
    if (returnKind === 'utf8') {
        return typeof expected === 'string';
    }
    if (returnKind === 'bool') {
        return typeof expected === 'boolean';
    }
    if (returnKind === 'i64') {
        return isIntegerExpectation(expected);
    }
    if (returnKind === 'unit') {
        return expected === null;
    }
    if (returnKind === 'i64[]') {
        return Array.isArray(expected) && expected.every(isIntegerExpectation);
    }
    return false;
}

/**
 * 严格模式的返回值比对，按清单返回载体选择口径。
 *
 * - `utf8`：宿主字符串逐字相等（`"00123"` 与 `"123"` 不同）；
 * - `i64`：实际值必须是 `bigint`，期望按十进制解析后逐位相等；
 * - `bool`：原生布尔严格相等；
 * - `i64[]`：元素必须是 `bigint`，长度一致且逐元素整数相等；
 * - `unit`：`null`。
 */
export function strictNativeMatch(actual: unknown, expected: unknown, returnKind: string): boolean {
    if (returnKind === 'utf8') {
        return typeof actual === 'string' && actual === expected;
    }
    if (returnKind === 'bool') {
        return actual === expected;
    }
    if (returnKind === 'i64') {
        if (typeof actual !== 'bigint') {
            return false;
        }
        const expectedValue = expectedInteger(expected);
        return expectedValue !== null && actual === expectedValue;
    }
    if (returnKind === 'unit') {
        return actual === null;
    }
    if (returnKind === 'i64[]') {
        return integerArraysMatch(actual, expected);
    }
    return false;
}

/** 整数序列比对：两侧都是数组、长度一致且逐元素按整数口径相等。 */
function integerArraysMatch(actual: unknown, expected: unknown): boolean {
    if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) {
        return false;
    }
    for (let index = 0; index < actual.length; index += 1) {
        if (typeof actual[index] !== 'bigint') {
            return false;
        }
        const expectedValue = expectedInteger(expected[index]);
        if (expectedValue === null || actual[index] !== expectedValue) {
            return false;
        }
    }
    return true;
}

/**
 * 原地写回题的题面契约 oracle。
 *
 * 语料对这类题只记 `expected: null`（LeetCode 约定：判题比较调用后的数组），
 * 没有逐字期望可比。契约按题面规则从原始实参推导，不猜值：
 * - `move-zeroes`：非零元素相对顺序不变，全部零补在尾部，长度与多重集守恒。
 * 无契约的题维持逐例如实跳过。
 */
function inPlaceContractViolation(problemId: string, original: unknown[], actual: unknown): string | null {
    if (problemId !== 'move-zeroes') {
        return null;
    }
    const source = original[0] as unknown[];
    if (!Array.isArray(actual)) {
        return `调用后数组未按原地写回投影为数组：${JSON.stringify(actual)}`;
    }
    if (actual.length !== source.length) {
        return `长度不守恒：原 ${String(source.length)}，后 ${String(actual.length)}`;
    }
    const toBigInt = (value: unknown): bigint | null => {
        if (typeof value === 'bigint') return value;
        if (typeof value === 'number' && Number.isSafeInteger(value)) return BigInt(value);
        return null;
    };
    const originals = source.map(toBigInt);
    const mutated = actual.map(toBigInt);
    if (originals.some((value) => value === null) || mutated.some((value) => value === null)) {
        return '元素超出整数承载形态，无法核对契约';
    }
    const big = mutated as bigint[];
    const nonZero = big.filter((value) => value !== 0n);
    const expectedNonZero = originals.filter((value) => value !== 0n) as bigint[];
    for (let position = 0; position < expectedNonZero.length; position += 1) {
        if (nonZero[position] !== expectedNonZero[position]) {
            return `非零元素相对顺序被破坏：位置 ${String(position)} 期望 ${String(expectedNonZero[position])}，实际 ${String(nonZero[position])}`;
        }
    }
    for (let position = expectedNonZero.length; position < big.length; position += 1) {
        if (big[position] !== 0n) {
            return `尾部应为零：位置 ${String(position)} 实际 ${String(big[position]!)}`;
        }
    }
    return null;
}

function hasInPlaceContract(problemId: string): boolean {
    return problemId === 'move-zeroes';
}

function encodeArguments(argumentsList: NativeArgument[]): string {
    return JSON.stringify(argumentsList);
}

function decodeResult(stdout: string): unknown {
    const parsed = JSON.parse(stdout, (_key, value) =>
        value !== null && typeof value === 'object' && typeof value.__bigint === 'string'
            ? BigInt(value.__bigint)
            : value) as { value: unknown };
    return parsed.value;
}

function quoteForCommand(argument: string): string {
    return /\s/.test(argument) ? `"${argument}"` : argument;
}

/**
 * 对本次原生 addon 执行全量 `<slug>.cases.ts`。
 *
 * 首个真实断言失败即中止；已在失败前通过的用例如实计数，剩余记 `not_run`。
 * addon 缺失导出或调用抛错按 `blocked` 记（基础设施/guest trap，不算断言失败）。
 */
export function runNativeReference(problemRoot: string, artifact: NativeArtifact): NativeRunOutcome {
    let firstCommand: string | null = null;
    const addonPath = artifact.addonPath;
    try {
        const snapshot = loadTestCases(problemRoot);
        const { invoke } = loadMetadata(problemRoot);
        const problemId = problemIdFromDir(problemRoot);
        const compareMode = compareModeForExecution(problemId);
        const exportName = resolveManifestExportName(artifact.exports, invoke);
        // 清单冻结的载体签名：实参与期望的编组口径只由它决定，不凭值形状猜测。
        // `resolveNativeArtifact` 已保证签名完整；这里缺失属于合同破坏。
        const signature = artifact.signatures[exportName];
        if (signature === undefined) {
            throw new Error(`执行清单未提供导出 ${exportName} 的冻结载体签名`);
        }

        let pass = 0;
        let skippedTimeout = 0;
        let skippedArgument = 0;
        const executable = snapshot.executableEntries;
        for (const [position, snapshotEntry] of executable.entries()) {
            const index = snapshotEntry.sourceIndex;
            const testCase = snapshotEntry.case as TestCase;
            if (testCase.expected === NO_EXECUTABLE_EXPECTATION) {
                skippedTimeout += 1;
                continue;
            }
            // guest 异常期望：仅在实参可编组时真实调用，并按结构化类别匹配；
            // 不能把宿主参数错误或进程崩溃冒充成可通过的 guest 异常。
            const expectsGuestError = typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:');
            const expectedErrorText = expectsGuestError
                ? (testCase.expected as string).slice('Error:'.length).trim()
                : null;
            // 用例字段按清单冻结的形参声明名绑定；键集合与数量不符即合同破坏，
            // 不能退回对象键序去猜。
            const rawValues = bindNativeArguments(testCase.args, signature.parameterNames);
            if (rawValues === null) {
                throw new Error(
                    `tests[${index}] 实参字段 ${JSON.stringify(Object.keys(testCase.args))} 与冻结形参 ${JSON.stringify(signature.parameterNames)} 不匹配`,
                );
            }
            // 原地修改题（unit 返回、数组实参）在当前语料里只把 `expected` 记为 null。
            // 有题面契约 oracle 的题真实调用并按契约核对写回结果；无契约的题如实跳过，
            // 不用 null 去否定真实的原地结果。
            const inPlaceOracle = !expectsGuestError
                && testCase.expected === null
                && rawValues.length === 1
                && Array.isArray(rawValues[0])
                && hasInPlaceContract(problemId);
            if (!expectsGuestError && !inPlaceOracle && testCase.expected === null && rawValues.some((rawValue) => Array.isArray(rawValue))) {
                skippedArgument += 1;
                continue;
            }
            const argumentsList: NativeArgument[] = [];
            let unsupported = false;
            for (const [parameterIndex, rawValue] of rawValues.entries()) {
                const argument = nativeArgument(rawValue, signature.parameters[parameterIndex] ?? '');
                if (argument === null) {
                    unsupported = true;
                    break;
                }
                argumentsList.push(argument);
            }
            if (unsupported || (!expectsGuestError && !isExecutableExpectation(testCase.expected, signature.returns))) {
                skippedArgument += 1;
                continue;
            }

            const argumentsJson = encodeArguments(argumentsList);
            const command = [process.execPath, addonPath, exportName, argumentsJson]
                .map(quoteForCommand)
                .join(' ');
            if (firstCommand === null) {
                firstCommand = command;
            }
            const spawned = spawnSync(
                process.execPath,
                ['-e', NATIVE_CASE_SCRIPT, addonPath, exportName, argumentsJson, signature.returns],
                { encoding: 'utf8', timeout: CASE_TIMEOUT_MILLISECONDS, maxBuffer: CASE_MAX_BUFFER_BYTES, windowsHide: true },
            );
            const remaining = executable.length - position - 1;
            if (spawned.error) {
                return blockedNativeOutcome(
                    `tests[${index}] 启动失败: ${String(spawned.error)}（${command}）`,
                    'runner-error',
                    snapshot,
                    pass,
                    skippedTimeout,
                    skippedArgument,
                    remaining,
                    firstCommand,
                    spawned.status,
                );
            }
            if (spawned.status !== 0) {
                const failure = classifyNativeFailure(spawned.status, spawned.signal, spawned.stdout, spawned.stderr);
                if (expectsGuestError && failure.kind === 'guest-failure') {
                    if (errorMessageMatches(failure.message, expectedErrorText ?? '')) {
                        pass += 1;
                        continue;
                    }
                    const message = `tests[${index}]: 期望 guest 异常 ${JSON.stringify(expectedErrorText)}，实际 ${failure.message}（${command}）`;
                    return assertionFailureOutcome(
                        message,
                        snapshot,
                        pass,
                        skippedTimeout,
                        skippedArgument,
                        remaining,
                        firstCommand,
                        spawned.status,
                    );
                }
                if (expectsGuestError && failure.kind === 'host-argument-error') {
                    // 宿主参数无法无损表达，不能算作 guest 异常验证。
                    skippedArgument += 1;
                    continue;
                }
                return blockedNativeOutcome(
                    `tests[${index}] 原生调用失败 [${failure.kind}] ${failure.message}（${command}）`,
                    failure.kind,
                    snapshot,
                    pass,
                    skippedTimeout,
                    skippedArgument,
                    remaining,
                    firstCommand,
                    spawned.status,
                );
            }
            if (expectsGuestError) {
                const message = `tests[${index}]: 期望 guest 异常 ${JSON.stringify(expectedErrorText)}，但原生调用成功（${command}）`;
                return {
                    ok: false,
                    error: message,
                    command: firstCommand,
                    exitStatus: spawned.status,
                    failureKind: null,
                    caseStats: {
                        ...emptySolverCaseStats(message),
                        testCaseTotal: snapshot.entries.length,
                        executed_pass: pass,
                        executed_fail: 1,
                        not_run: remaining,
                        skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
                        skipped_timeout: skippedTimeout,
                        skipped_integer_argument: skippedArgument,
                        skipped_corpus_defect: snapshot.excludedEntries.length,
                        casesSource: snapshot.source,
                        casesDigest: snapshot.sourceDigest,
                        firstFailureIndex: extractTestFailureIndex(message),
                        firstFailure: message,
                    },
                };
            }

            const actual = decodeResult(spawned.stdout);
            if (inPlaceOracle) {
                // 按题面契约核对原地写回：违反契约即断言失败，满足即真实通过。
                const violation = inPlaceContractViolation(problemId, rawValues, actual);
                if (violation !== null) {
                    const message = `tests[${index}]: 原地写回不满足题面契约：${violation}（${command}）`;
                    return assertionFailureOutcome(
                        message,
                        snapshot,
                        pass,
                        skippedTimeout,
                        skippedArgument,
                        remaining,
                        firstCommand,
                        spawned.status,
                    );
                }
                pass += 1;
                continue;
            }
            const expected = testCase.expected ?? null;
            const matches =
                compareMode !== 'strict'
                    ? resultsMatch(actual, expected, compareMode, { problemId, args: testCase.args })
                    : strictNativeMatch(actual, expected, signature.returns);
            if (!matches) {
                const message = `tests[${index}]: expected ${JSON.stringify(expected, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}, got ${JSON.stringify(actual, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}（${command}）`;
                return {
                    ok: false,
                    error: message,
                    command: firstCommand,
                    exitStatus: spawned.status,
                    failureKind: null,
                    caseStats: {
                        ...emptySolverCaseStats(message),
                        testCaseTotal: snapshot.entries.length,
                        executed_pass: pass,
                        executed_fail: 1,
                        not_run: remaining,
                        skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
                        skipped_timeout: skippedTimeout,
                        skipped_integer_argument: skippedArgument,
                        skipped_corpus_defect: snapshot.excludedEntries.length,
                        casesSource: snapshot.source,
                        casesDigest: snapshot.sourceDigest,
                        firstFailureIndex: extractTestFailureIndex(message),
                        firstFailure: message,
                    },
                };
            }
            pass += 1;
        }

        return {
            ok: true,
            error: null,
            command: firstCommand,
            exitStatus: pass > 0 ? 0 : null,
            failureKind: null,
            caseStats: {
                ok: true,
                testCaseTotal: snapshot.entries.length,
                executed_pass: pass,
                executed_fail: 0,
                blocked: 0,
                not_run: 0,
                skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
                skipped_timeout: skippedTimeout,
                skipped_integer_argument: skippedArgument,
                skipped_corpus_defect: snapshot.excludedEntries.length,
                casesSource: snapshot.source,
                casesDigest: snapshot.sourceDigest,
                firstFailureIndex: null,
                firstFailure: null,
            },
        };
    }
    catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        return {
            ok: false,
            error: message,
            command: firstCommand,
            exitStatus: null,
            failureKind: 'runner-error',
            caseStats: emptySolverCaseStats(message),
        };
    }
}

/** 子进程 stdout 里的结构化异常信封。 */
type NativeErrorEnvelope = {
    kind: 'host-argument-error' | 'guest-failure';
    name: string;
    message: string;
};

function parseNativeError(stdout: string): NativeErrorEnvelope | null {
    try {
        const parsed = JSON.parse(stdout) as { __nativeError?: Partial<NativeErrorEnvelope> };
        const envelope = parsed.__nativeError;
        if (envelope === undefined
            || (envelope.kind !== 'host-argument-error' && envelope.kind !== 'guest-failure')) {
            return null;
        }
        return { kind: envelope.kind, name: String(envelope.name ?? 'Error'), message: String(envelope.message ?? '') };
    }
    catch {
        return null;
    }
}

/**
 * 把子进程退出状态归入四类：宿主参数错误 / guest 失败 / 运行器错误 / 进程崩溃。
 *
 * Windows 上崩溃退出码可能是 NTSTATUS 的 0x8xxxxxxx（spawnSync 可能给出有符号
 * 负数，也可能给出无符号原值），两种形态都按进程崩溃记录。
 */
export function classifyNativeFailure(
    status: number | null,
    signal: NodeJS.Signals | null,
    stdout: string,
    stderr: string,
): { kind: NativeFailureKind; message: string } {
    if (signal !== null) {
        return { kind: 'process-crash', message: `进程被信号 ${signal} 终止` };
    }
    if (status === null) {
        return { kind: 'process-crash', message: '进程无退出码（疑似崩溃）' };
    }
    if (status === 3) {
        return { kind: 'runner-error', message: `native addon 缺少清单声明的导出（stderr: ${stderr.trim() || '(empty)'}）` };
    }
    if (status === 4) {
        const envelope = parseNativeError(stdout);
        if (envelope !== null) {
            return { kind: envelope.kind, message: `${envelope.name}: ${envelope.message}` };
        }
        return { kind: 'guest-failure', message: `guest 调用抛出未分类异常（stderr: ${stderr.trim() || '(empty)'}）` };
    }
    if (status === 5) {
        const mismatch = parseReturnTypeError(stdout);
        if (mismatch !== null) {
            return {
                kind: 'runner-error',
                message: `返回值不是清单冻结的返回载体 ${mismatch.expected}（实际 ${mismatch.actual}）`,
            };
        }
        return { kind: 'runner-error', message: `返回值载体断言失败（stderr: ${stderr.trim() || '(empty)'}）` };
    }
    if (status < 0 || status >= 0x80000000) {
        return { kind: 'process-crash', message: `NTSTATUS 崩溃退出码 0x${(status >>> 0).toString(16)}` };
    }
    return { kind: 'runner-error', message: `未预期的原生子进程退出码 ${status}（stderr: ${stderr.trim() || '(empty)'}）` };
}

/**
 * 子进程 stdout 里的返回载体不符信封：实际返回值不是清单冻结的返回类型。
 * 这是载体合同破坏（runner-error），不是断言失败。
 */
function parseReturnTypeError(stdout: string): { expected: string; actual: string } | null {
    try {
        const parsed = JSON.parse(stdout) as { __nativeReturnTypeError?: { expected?: unknown; actual?: unknown } };
        const envelope = parsed.__nativeReturnTypeError;
        if (envelope === undefined || typeof envelope.expected !== 'string' || typeof envelope.actual !== 'string') {
            return null;
        }
        return { expected: envelope.expected, actual: envelope.actual };
    }
    catch {
        return null;
    }
}

/** 预期 guest 异常与结构化消息按空白归一后互相包含即匹配。 */
function errorMessageMatches(actual: string, expected: string): boolean {
    const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
    const left = normalize(actual);
    const right = normalize(expected);
    if (left.length === 0 || right.length === 0) {
        return false;
    }
    return left.includes(right) || right.includes(left);
}

/** 已执行用例的断言失败（期望不符）：进 fail 分母，不归为基础设施阻塞。 */
function assertionFailureOutcome(
    message: string,
    snapshot: ReturnType<typeof loadTestCases>,
    pass: number,
    skippedTimeout: number,
    skippedArgument: number,
    remaining: number,
    command: string | null,
    exitStatus: number | null,
): NativeRunOutcome {
    return {
        ok: false,
        error: message,
        command,
        exitStatus,
        failureKind: null,
        caseStats: {
            ...emptySolverCaseStats(message),
            testCaseTotal: snapshot.entries.length,
            executed_pass: pass,
            executed_fail: 1,
            not_run: remaining,
            skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
            skipped_timeout: skippedTimeout,
            skipped_integer_argument: skippedArgument,
            skipped_corpus_defect: snapshot.excludedEntries.length,
            casesSource: snapshot.source,
            casesDigest: snapshot.sourceDigest,
            firstFailureIndex: extractTestFailureIndex(message),
            firstFailure: message,
        },
    };
}

/** addon 层阻塞（缺导出 / 调用抛错 / 启动失败）：记 `blocked`，不算断言失败。 */
function blockedNativeOutcome(
    message: string,
    failureKind: NativeFailureKind,
    snapshot: ReturnType<typeof loadTestCases>,
    pass: number,
    skippedTimeout: number,
    skippedArgument: number,
    remaining: number,
    command: string | null,
    exitStatus: number | null,
): NativeRunOutcome {
    return {
        ok: false,
        error: message,
        command,
        exitStatus,
        failureKind,
        caseStats: {
            ...emptySolverCaseStats(message),
            testCaseTotal: snapshot.entries.length,
            executed_pass: pass,
            blocked: 1,
            not_run: remaining,
            skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
            skipped_timeout: skippedTimeout,
            skipped_integer_argument: skippedArgument,
            skipped_corpus_defect: snapshot.excludedEntries.length,
            casesSource: snapshot.source,
            casesDigest: snapshot.sourceDigest,
            firstFailureIndex: extractTestFailureIndex(message),
        },
    };
}

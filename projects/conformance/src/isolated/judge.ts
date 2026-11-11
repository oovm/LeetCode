/**
 * 隔离判题器（父进程侧）。
 *
 * 判题器只负责：装载用例（`<slug>.cases.ts` 或 metadata.json 回退）、校验 schema 与数值保真、
 * 经 NDJSON 协议把用例发给独立的解法子进程、回收结果并断言、汇总计时。
 * 判题进程从不 import 解法；解法子进程从不加载判题/断言代码 —— JIT 上下文完全分离。
 * Node 与 Bun 子进程跑同一份 `child-typescript.ts`，同协议同计时口径。
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { bunExecutable } from '../adapters/typescript-bun/bridge.ts';
import { assertTestCase, normalizeTsTestResult } from '../domain/assert.ts';
import { compareModeForExecution, formatValue, resultsMatch, type CompareMode, type MatchContext } from '../domain/compare-mode.ts';
import { coerceIntegerArgs, inferIntegerArgKeys } from '../domain/integer-args.ts';
import { compareIntegerResult } from '../domain/integer-literal.ts';
import {
    assertOperationSequence,
    isOperationSequenceCase,
    operationSequenceUnsupportedReason,
    type OperationSequenceCase,
} from '../domain/operation-sequence.ts';
import { CONFORMANCE_ROOT } from '../domain/paths.ts';
import { partitionCases, validateCasesModule, type ProblemCase } from './cases.ts';
import {
    createLineAssembler,
    decodeLine,
    decodeValue,
    encodeLine,
    encodeValue,
    ProtocolDecodeError,
    UnsafeNumberError,
    type CaseOutcome,
    type JudgeMessage,
    type RunCase,
    type SolverMessage,
    type TaggedValue,
} from './protocol.ts';
import { normalizeResultByAbiType } from './v-shared.ts';
import type { WasmAbiType } from '../adapters/valkyrie-node/abi.ts';

export type JudgeLane =
    | 'typescript'
    | 'typescript-bun'
    | 'python'
    | 'valkyrie-wasm'
    | 'valkyrie-ovm'
    | 'valkyrie-jvm'
    | 'valkyrie-clr';

export type JudgeFailureKind =
    | 'cases_missing'
    | 'cases_schema'
    | 'unsafe_number'
    | 'spawn_failed'
    | 'load_failed'
    | 'solver_exit'
    | 'solver_timeout'
    | 'protocol_error'
    | 'assert_failed'
    | 'solver_error';

export type JudgeOptions = {
    problemDir: string;
    lane: JudgeLane;
    /** 显式用例模块路径；缺省按 `<problemDir>/<id>.cases.ts` 探测，再回退 metadata.json。 */
    casesPath?: string;
    /** valkyrie lane 必填：legion build 产物目录（含 *.mjs glue 与 *.wasm）。 */
    artifactDir?: string;
    iterations?: number;
    warmup?: number;
    /** run 阶段看门狗（毫秒），超时杀子进程并结构化失败。 */
    runTimeoutMs?: number;
};

export type JudgeResult = {
    ok: boolean;
    failureKind: JudgeFailureKind | null;
    message: string | null;
    slug: string;
    lane: JudgeLane;
    casesSource: string;
    casesTotal: number;
    defectSkipped: number;
    executed: number;
    passed: number;
    failed: number;
    firstFailureIndex: number | null;
    runtimeMs: number | null;
    iterations: number;
    warmup: number;
    childPid: number | null;
    command: string;
};

const CHILD_TYPESCRIPT = join(CONFORMANCE_ROOT, 'src', 'isolated', 'child-typescript.ts');
const CHILD_VALKYRIE_WASM = join(CONFORMANCE_ROOT, 'src', 'isolated', 'child-valkyrie-wasm.ts');
const CHILD_VALKYRIE_OVM = join(CONFORMANCE_ROOT, 'src', 'isolated', 'child-valkyrie-ovm.ts');
const CHILD_VALKYRIE_MANAGED = join(CONFORMANCE_ROOT, 'src', 'isolated', 'child-valkyrie-managed.ts');
const CHILD_PYTHON = join(CONFORMANCE_ROOT, 'scripts', 'isolated_python_child.py');

const DEFAULT_ITERATIONS = 50;
const DEFAULT_WARMUP = 5;
const DEFAULT_RUN_TIMEOUT_MS = 240_000;

function median(values: number[]): number {
    const sorted = [...values].sort((left, right) => left - right);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1]! + sorted[mid]!) / 2 : sorted[mid]!;
}

type ProblemMeta = { id: string; invoke: Record<string, string | undefined> };

function loadEnvelope(problemDir: string): ProblemMeta {
    const metaPath = join(problemDir, 'metadata.json');
    if (!existsSync(metaPath)) {
        throw new Error(`missing metadata: ${metaPath}`);
    }
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as { id?: string; tests?: unknown; invoke?: Record<string, string | undefined> };
    const id = meta.id?.trim();
    if (!id) {
        throw new Error('metadata.id 缺失');
    }
    return { id, invoke: meta.invoke ?? {} };
}

function invokeKeyForLane(lane: JudgeLane): string {
    return lane === 'python' ? 'python' : lane.startsWith('valkyrie') ? 'valkyrie' : 'typescript';
}

function spawnCommand(lane: JudgeLane): { command: string; args: string[]; display: string } {
    if (lane === 'typescript-bun') {
        const exe = bunExecutable();
        return { command: exe, args: [CHILD_TYPESCRIPT], display: `bun ${CHILD_TYPESCRIPT}` };
    }
    if (lane === 'python') {
        return { command: 'python', args: [CHILD_PYTHON], display: `python ${CHILD_PYTHON}` };
    }
    if (lane === 'valkyrie-ovm') {
        return { command: process.execPath, args: ['--import', 'tsx', CHILD_VALKYRIE_OVM], display: `node --import tsx ${CHILD_VALKYRIE_OVM}` };
    }
    if (lane === 'valkyrie-jvm' || lane === 'valkyrie-clr') {
        return { command: process.execPath, args: ['--import', 'tsx', CHILD_VALKYRIE_MANAGED], display: `node --import tsx ${CHILD_VALKYRIE_MANAGED}` };
    }
    if (lane === 'valkyrie-wasm') {
        return { command: process.execPath, args: ['--import', 'tsx', CHILD_VALKYRIE_WASM], display: `node --import tsx ${CHILD_VALKYRIE_WASM}` };
    }
    return { command: process.execPath, args: ['--import', 'tsx', CHILD_TYPESCRIPT], display: `node --import tsx ${CHILD_TYPESCRIPT}` };
}

async function loadCases(
    options: JudgeOptions,
    meta: ProblemMeta,
): Promise<
    | { ok: true; cases: ProblemCase[]; source: string }
    | { ok: false; failureKind: 'cases_missing' | 'cases_schema' | 'unsafe_number'; message: string }
> {
    const defaultCasesPath = join(options.problemDir, `${meta.id}.cases.ts`);
    const explicit = options.casesPath;
    const candidatesPath = explicit ?? (existsSync(defaultCasesPath) ? defaultCasesPath : null);
    if (candidatesPath !== null) {
        if (!existsSync(candidatesPath)) {
            return { ok: false, failureKind: 'cases_missing', message: `用例模块不存在：${candidatesPath}` };
        }
        const mod = (await import(pathToFileURL(candidatesPath).href)) as { cases?: unknown };
        const validation = validateCasesModule(mod.cases, candidatesPath);
        if (!validation.ok) {
            return validation;
        }
        return { ok: true, cases: [...validation.cases], source: candidatesPath };
    }
    const metaPath = join(options.problemDir, 'metadata.json');
    const parsed = JSON.parse(readFileSync(metaPath, 'utf8')) as { tests?: unknown };
    const validation = validateCasesModule(parsed.tests, `${metaPath}#tests`);
    if (!validation.ok) {
        return validation;
    }
    return { ok: true, cases: [...validation.cases], source: `${metaPath}#tests` };
}

export async function runIsolatedJudge(options: JudgeOptions): Promise<JudgeResult> {
    const iterations = options.iterations ?? DEFAULT_ITERATIONS;
    const warmup = options.warmup ?? DEFAULT_WARMUP;
    const runTimeoutMs = options.runTimeoutMs ?? DEFAULT_RUN_TIMEOUT_MS;

    const meta = loadEnvelope(options.problemDir);
    const invokeKey = invokeKeyForLane(options.lane);
    const base: Omit<JudgeResult, 'ok' | 'failureKind' | 'message'> = {
        slug: meta.id,
        lane: options.lane,
        casesSource: '',
        casesTotal: 0,
        defectSkipped: 0,
        executed: 0,
        passed: 0,
        failed: 0,
        firstFailureIndex: null,
        runtimeMs: null,
        iterations,
        warmup,
        childPid: null,
        command: '',
    };
    const fail = (failureKind: JudgeFailureKind, message: string, extra?: Partial<JudgeResult>): JudgeResult => ({
        ...base,
        ...extra,
        ok: false,
        failureKind,
        message,
    });

    const invoke = meta.invoke[invokeKey]?.trim();
    if (!invoke) {
        return fail('load_failed', `metadata.invoke.${invokeKey} 缺失`);
    }

    const loaded = await loadCases(options, meta);
    if (!loaded.ok) {
        return fail(loaded.failureKind, loaded.message, { casesSource: options.casesPath ?? '' });
    }
    const partitioned = partitionCases(loaded.cases);
    const integerKeys = inferIntegerArgKeys(partitioned.executable);

    let wireCases: RunCase[];
    try {
        wireCases = partitioned.executable.map((entry, index) => ({
            index,
            args: encodeValue(coerceIntegerArgs(entry.args, integerKeys), `cases[${index}].args`) as Record<string, TaggedValue>,
        }));
    } catch (err) {
        if (err instanceof UnsafeNumberError) {
            return fail('unsafe_number', err.message, { casesSource: loaded.source, casesTotal: loaded.cases.length });
        }
        throw err;
    }

    const lane = spawnCommand(options.lane);
    base.command = lane.display;
    const child = spawn(lane.command, lane.args, { cwd: CONFORMANCE_ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
    base.childPid = child.pid ?? null;

    let stderrTail = '';
    child.stderr.on('data', (chunk: Buffer | string) => {
        stderrTail = `${stderrTail}${String(chunk)}`.slice(-8192);
    });

    const inbox: SolverMessage[] = [];
    let exited: { code: number | null; signal: string | null } | null = null;
    let spawnError: string | null = null;
    let protocolError: string | null = null;
    child.on('error', (err) => {
        spawnError = err.message;
        exited = { code: null, signal: 'SPAWN_ERROR' };
    });
    child.stdin.on('error', () => {
        // 子进程已退出时 stdin 写失败（EPIPE）属预期路径，由 solver_exit 统一承载。
    });
    child.on('exit', (code, signal) => {
        exited = { code, signal };
    });
    child.stdout.on(
        'data',
        createLineAssembler((line) => {
            try {
                inbox.push(decodeLine(line) as SolverMessage);
            } catch (err) {
                protocolError = err instanceof ProtocolDecodeError ? err.message : String(err);
            }
        }),
    );

    const send = (message: JudgeMessage): void => {
        try {
            child.stdin.write(encodeLine(message));
        } catch {
            // 子进程已断开；后续 waitFor 观察到 exited 后按 solver_exit 结构化失败。
        }
    };

    const waitFor = async (predicate: (message: SolverMessage) => boolean, timeoutMs: number): Promise<SolverMessage | null> => {
        const started = Date.now();
        for (;;) {
            if (protocolError !== null) {
                throw new ProtocolDecodeError(protocolError);
            }
            const index = inbox.findIndex(predicate);
            if (index >= 0) {
                return inbox.splice(index, 1)[0]!;
            }
            if (exited !== null) {
                return null;
            }
            if (Date.now() - started > timeoutMs) {
                return null;
            }
            await new Promise((resolve) => setTimeout(resolve, 5));
        }
    };

    const cleanup = async (): Promise<void> => {
        try {
            if (exited === null) {
                send({ type: 'bye' });
                await new Promise((resolve) => setTimeout(resolve, 200));
            }
        } catch {
            // 子进程已断开
        }
        if (exited === null) {
            child.kill();
        }
    };

    const exitDescription = (): string => {
        const spawnNote = spawnError !== null ? `spawn 失败：${spawnError}；` : '';
        const suffix = stderrTail.trim().length > 0 ? `；stderr 尾部：${stderrTail.trim().slice(-500)}` : '';
        return `${spawnNote}解法子进程异常退出（code=${exited?.code ?? 'null'} signal=${exited?.signal ?? 'null'}）${suffix}`;
    };

    try {
        send({
            type: 'load',
            invoke,
            solution: solutionPathForLane(options),
            artifactDir: options.artifactDir,
            lane: managedLaneFor(options.lane),
        });
        const ready = await waitFor((message) => message.type === 'ready' || message.type === 'error', 60_000);
        if (ready === null) {
            const kind = exited !== null ? 'solver_exit' : 'solver_timeout';
            return fail(kind, exited !== null ? exitDescription() : 'load 阶段超时', { casesSource: loaded.source, casesTotal: loaded.cases.length });
        }
        if (ready.type === 'error') {
            return fail('load_failed', ready.message, { casesSource: loaded.source, casesTotal: loaded.cases.length });
        }
        const returnsAbi = (ready.returnsAbi ?? null) as WasmAbiType | null;

        send({ type: 'run', warmup, iterations, cases: wireCases });
        let done: SolverMessage | null;
        try {
            done = await waitFor((message) => message.type === 'done' || message.type === 'error', runTimeoutMs);
        } catch (err) {
            if (err instanceof ProtocolDecodeError) {
                return fail('protocol_error', err.message, { casesSource: loaded.source, casesTotal: loaded.cases.length });
            }
            throw err;
        }
        if (done === null) {
            if (exited !== null) {
                return fail('solver_exit', exitDescription(), { casesSource: loaded.source, casesTotal: loaded.cases.length });
            }
            child.kill();
            return fail('solver_timeout', `run 阶段超过 ${runTimeoutMs}ms 未回包，已终止子进程`, {
                casesSource: loaded.source,
                casesTotal: loaded.cases.length,
            });
        }
        if (done.type === 'error') {
            return fail('solver_error', done.message, { casesSource: loaded.source, casesTotal: loaded.cases.length });
        }

        let passed = 0;
        let firstFailureIndex: number | null = null;
        let firstFailure: string | null = null;
        const compareMode = compareModeForExecution(meta.id);
        for (const outcome of done.results) {
            const entry = partitioned.executable[outcome.index]!;
            const expectedRaw = normalizeTsTestResult(entry.expected);
            try {
                const operationCase = isOperationSequenceCase(entry) ? (entry as OperationSequenceCase) : null;
                const matchContext = { problemId: meta.id, args: entry.args as Record<string, unknown> };
                if (operationCase !== null) {
                    if (options.lane.startsWith('valkyrie')) {
                        throw new Error(operationSequenceUnsupportedReason(options.lane));
                    }
                    assertScriptOperationOutcome(outcome, operationCase);
                } else if (options.lane === 'valkyrie-wasm') {
                    assertValkyrieOutcome(outcome, expectedRaw, returnsAbi, compareMode, matchContext);
                } else if (options.lane.startsWith('valkyrie')) {
                    assertNumericTextOutcome(outcome, expectedRaw, compareMode, matchContext);
                } else {
                    assertScriptOutcome(outcome, expectedRaw, compareMode, matchContext);
                }
                passed += 1;
            } catch (err) {
                firstFailureIndex = outcome.index;
                firstFailure = err instanceof Error ? err.message : String(err);
                break;
            }
        }

        const failed = done.results.length - passed;
        return {
            ...base,
            ok: failed === 0,
            failureKind: failed === 0 ? null : 'assert_failed',
            message: firstFailure,
            casesSource: loaded.source,
            casesTotal: loaded.cases.length,
            defectSkipped: partitioned.defect.length,
            executed: done.results.length,
            passed,
            failed,
            firstFailureIndex,
            runtimeMs: done.samples.length > 0 ? median(done.samples) : null,
        };
    } catch (err) {
        if (err instanceof ProtocolDecodeError) {
            return fail('protocol_error', err.message, { casesSource: loaded.source, casesTotal: loaded.cases.length });
        }
        throw err;
    } finally {
        await cleanup();
    }
}

function solutionPathForLane(options: JudgeOptions): string | undefined {
    if (options.lane === 'python') {
        return join(options.problemDir, 'solvers', 'python', 'solution.py');
    }
    if (options.lane.startsWith('valkyrie')) {
        return undefined;
    }
    return join(options.problemDir, 'solvers', 'typescript', 'solution.ts');
}

function managedLaneFor(lane: JudgeLane): 'jvm' | 'clr' | undefined {
    if (lane === 'valkyrie-jvm') {
        return 'jvm';
    }
    if (lane === 'valkyrie-clr') {
        return 'clr';
    }
    return undefined;
}

/** TS/Python lane：解法异常与 `Error:` 期望按既有 `assertTestCase` 口径比对。 */
function assertScriptOutcome(outcome: CaseOutcome, expected: unknown, mode: CompareMode, context: MatchContext): void {
    if (!outcome.ok) {
        if (typeof expected === 'string' && expected.startsWith('Error:')) {
            const actual = `Error: ${outcome.error}`;
            if (actual === expected) {
                return;
            }
            throw new Error(`tests[${outcome.index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
        throw new Error(`tests[${outcome.index}]: 解法抛错 ${outcome.error}`);
    }
    const value = decodeValue(outcome.value, `tests[${outcome.index}].result`);
    assertTestCase(outcome.index, expected, () => value, undefined, mode, context);
}

/** TS/Python lane 的设计类用例：实例已由子进程构造并按操作序列逐步调用，这里逐步断言。 */
function assertScriptOperationOutcome(outcome: CaseOutcome, operationCase: OperationSequenceCase): void {
    if (!outcome.ok) {
        throw new Error(`tests[${outcome.index}]: 解法抛错 ${outcome.error}`);
    }
    const value = decodeValue(outcome.value, `tests[${outcome.index}].result`);
    assertOperationSequence(outcome.index, operationCase.args, operationCase.expected, value);
}

/** valkyrie lane（wasm）：按 ABI 返回类型把期望值同样规整为十进制文本后比较（对齐 `run_v_solver.ts`）。 */
export function assertValkyrieOutcome(
    outcome: CaseOutcome,
    expected: unknown,
    returnsAbi: WasmAbiType | null,
    mode: CompareMode,
    context: MatchContext,
): void {
    if (!outcome.ok) {
        if (typeof expected === 'string' && expected.startsWith('Error:')) {
            // 验收观察门：预期 trap 只接受明确的 guest trap 类型与原因；
            // glue/ABI/JS TypeError 等宿主侧异常即使文本恰好匹配也不得判为通过。
            if (outcome.guestTrap === undefined) {
                throw new Error(
                    `tests[${outcome.index}]: expected guest trap, got host anomaly${outcome.phase ? ` phase=${outcome.phase}` : ''}: ${outcome.error}`,
                );
            }
            const actual = `Error: ${outcome.error}`;
            if (actual === expected) {
                return;
            }
            throw new Error(`tests[${outcome.index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
        throw new Error(`tests[${outcome.index}]: 解法抛错 ${outcome.error}`);
    }
    const actual = decodeValue(outcome.value, `tests[${outcome.index}].result`);
    const normalizedExpected = returnsAbi ? normalizeResultByAbiType(expected, returnsAbi) : expected;
    if (!resultsMatch(actual, normalizedExpected, mode, context)) {
        throw new Error(
            `tests[${outcome.index}]: expected ${formatValue(normalizedExpected)}, got ${formatValue(actual)}（compareMode=${mode}）`,
        );
    }
}

/**
 * valkyrie ovm/jvm/clr lane：整数结果两侧规整为精确十进制文本比较
 * （对齐 `run_nyar_solver.ts` 与 `managed-runner.ts` 口径），其余形态按结构比较。
 *
 * `Error:` 期望保持消息精确匹配：napi/managed 宿主尚未冻结 guest trap 类型表，
 * 强行套用 wasm lane 的 guest trap 门会把未分类的真实 guest 失败误判为宿主异常；
 * 子进程若能明确识别 guest trap 会以 `guestTrap` 字段随包携带，供报告区分。
 */
function assertNumericTextOutcome(outcome: CaseOutcome, expected: unknown, mode: CompareMode, context: MatchContext): void {
    if (!outcome.ok) {
        if (typeof expected === 'string' && expected.startsWith('Error:')) {
            const actual = `Error: ${outcome.error}`;
            if (actual === expected) {
                return;
            }
            throw new Error(`tests[${outcome.index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
        throw new Error(`tests[${outcome.index}]: 解法抛错 ${outcome.error}`);
    }
    const actual = decodeValue(outcome.value, `tests[${outcome.index}].result`);
    if (mode !== 'strict') {
        if (resultsMatch(actual, expected, mode, context)) {
            return;
        }
        throw new Error(
            `tests[${outcome.index}]: expected ${formatValue(expected)}, got ${formatValue(actual)}（compareMode=${mode}）`,
        );
    }
    const cmp = compareIntegerResult(actual, expected);
    if (cmp === true) {
        return;
    }
    if (cmp === false) {
        throw new Error(`tests[${outcome.index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`tests[${outcome.index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

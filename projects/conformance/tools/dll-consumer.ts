/**
 * C ABI DLL 独立消费者（用 bun 运行：`bun tools/dll-consumer.ts <payload>`）。
 *
 * 输入是一个 JSON 信封（argv[2] 为内联 JSON 或 JSON 文件路径）：
 * `{ dllPath, symbol, parameters: string[], returns: string, args: (number|string|boolean)[] }`
 * ——签名由执行清单冻结，消费者只按声明的载体组合构造 FFI 调用，不按实参值形状猜。
 *
 * 行为：先校验签名组合是否在本消费者已实现的集合内（`i64` / `bool` / `f64`），
 * 未实现的组合在 `dlopen` 之前以 `stage: "abi"` 拒绝 → `dlopen` 装载 → 按符号名
 * 解析 → 按 Win64 C 调用约定调用 → 按返回载体投影，stdout 输出 JSON：
 * - 成功：`{ "ok": true, "kind": "i64" | "bool" | "f64", "result": ... }`
 *   （`i64` 用十进制字符串承载，避免 JSON 丢精度）；
 * - 结构化失败：`{ "ok": false, "stage": "abi" | "load" | "symbol" | "call", "error": "..." }`；
 * - 调用期进程崩溃（guest panic / 访问违例）不会产生 JSON，消费者以异常退出码终止，
 *   由 runner 侧按进程崩溃归类。
 *
 * 退出前显式 `dlclose`（`lib.close()`），不依赖进程退出隐式卸载。
 */
import { dlopen, FFIType } from 'bun:ffi';
import { readFileSync } from 'node:fs';

type ScalarKind = 'i64' | 'bool' | 'f64';

type ConsumerInput = {
    dllPath: string;
    symbol: string;
    parameters: ScalarKind[];
    returns: ScalarKind;
    args: (number | string | boolean)[];
};

/**
 * 已实现的 C ABI 标量载体。数组、文本与对象载体尚未冻结数据地址、长度与所有权，
 * 不在这里开放；清单给出这些签名时在进入 FFI 前结构化拒绝。
 */
const FFI_SCALARS: Record<ScalarKind, FFIType> = {
    i64: FFIType.i64,
    bool: FFIType.bool,
    f64: FFIType.f64,
};

function emit(payload: Record<string, unknown>): void {
    process.stdout.write(JSON.stringify(payload));
    process.exit(0);
}

function fail(stage: 'abi' | 'load' | 'symbol' | 'call', message: string): never {
    emit({ ok: false, stage, error: message });
}

function isScalarKind(value: unknown): value is ScalarKind {
    return value === 'i64' || value === 'bool' || value === 'f64';
}

const raw = process.argv[2];
if (raw === undefined || raw.length === 0) {
    fail('abi', '缺少输入 JSON（argv[2] 为内联 JSON 或 JSON 文件路径）');
}
let input: ConsumerInput;
try {
    const text = raw.trimStart().startsWith('{') ? raw : readFileSync(raw, 'utf8');
    input = JSON.parse(text) as ConsumerInput;
} catch (error) {
    fail('abi', `输入 JSON 解析失败：${error instanceof Error ? error.message : String(error)}`);
}
if (typeof input.dllPath !== 'string' || input.dllPath.length === 0
    || typeof input.symbol !== 'string' || input.symbol.length === 0
    || !Array.isArray(input.parameters)
    || !Array.isArray(input.args)) {
    fail('abi', '输入信封缺少 dllPath/symbol/parameters/args 字段');
}
if (input.args.length !== input.parameters.length) {
    fail('abi', `实参数量 ${String(input.args.length)} 与冻结形参 ${String(input.parameters.length)} 不一致`);
}
for (const [position, kind] of input.parameters.entries()) {
    if (!isScalarKind(kind)) {
        fail('abi', `形参[${String(position)}] 载体 ${JSON.stringify(kind)} 不在已实现的 C ABI 标量集合内`);
    }
}
if (!isScalarKind(input.returns)) {
    fail('abi', `返回载体 ${JSON.stringify(input.returns)} 不在已实现的 C ABI 标量集合内`);
}

function coerceArgument(position: number, kind: ScalarKind, value: unknown): bigint | boolean | number {
    if (kind === 'i64') {
        if (typeof value === 'number') {
            if (!Number.isSafeInteger(value)) {
                fail('abi', `args[${String(position)}] 数值 ${String(value)} 超出安全整数范围，无法无损送进 i64`);
            }
            return BigInt(value);
        }
        if (typeof value === 'bigint') {
            return value;
        }
        if (typeof value === 'string' && /^-?\d+$/.test(value)) {
            return BigInt(value);
        }
        fail('abi', `args[${String(position)}] 不是 i64 载体：${JSON.stringify(value)}`);
    }
    if (kind === 'bool') {
        if (typeof value === 'boolean') {
            return value;
        }
        fail('abi', `args[${String(position)}] 不是 bool 载体：${JSON.stringify(value)}`);
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    fail('abi', `args[${String(position)}] 不是 f64 载体：${JSON.stringify(value)}`);
}

const signature: Record<string, { args: FFIType[]; returns: FFIType }> = {
    [input.symbol]: {
        args: input.parameters.map((kind) => FFI_SCALARS[kind]),
        returns: FFI_SCALARS[input.returns],
    },
};

let lib: ReturnType<typeof dlopen>;
try {
    lib = dlopen(input.dllPath, signature);
} catch (error) {
    fail('load', `dlopen 失败：${error instanceof Error ? error.message : String(error)}`);
}

const fn = lib.symbols[input.symbol] as ((...args: (bigint | boolean | number)[]) => bigint | boolean | number) | undefined;
if (fn === undefined) {
    try {
        lib.close();
    } catch {
        // 符号缺失时卸载失败不掩盖主因。
    }
    fail('symbol', `符号解析失败：${input.symbol}`);
}

const argv: (bigint | boolean | number)[] = [];
for (const [position, value] of input.args.entries()) {
    argv.push(coerceArgument(position, input.parameters[position]!, value));
}

try {
    const result = fn(...argv);
    lib.close();
    if (input.returns === 'i64') {
        if (typeof result !== 'bigint') {
            fail('abi', `返回载体声明 i64，实际为 ${typeof result}`);
        }
        emit({ ok: true, kind: 'i64', result: result.toString() });
    }
    if (input.returns === 'bool') {
        if (typeof result !== 'boolean') {
            fail('abi', `返回载体声明 bool，实际为 ${typeof result}`);
        }
        emit({ ok: true, kind: 'bool', result });
    }
    if (typeof result !== 'number') {
        fail('abi', `返回载体声明 f64，实际为 ${typeof result}`);
    }
    emit({ ok: true, kind: 'f64', result });
} catch (error) {
    try {
        lib.close();
    } catch {
        // 调用失败时卸载失败不掩盖主因。
    }
    fail('call', `C 调用抛出：${error instanceof Error ? error.message : String(error)}`);
}

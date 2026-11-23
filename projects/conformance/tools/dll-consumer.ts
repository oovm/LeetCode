/**
 * C ABI DLL 独立消费者（用 bun 运行：`bun tools/dll-consumer.ts <payload>`）。
 *
 * 输入是一个 JSON 信封（argv[2] 为内联 JSON 或 JSON 文件路径）：
 * `{ dllPath, symbol, args: (number|string)[], returns: "i64" }`
 * ——`args` 元素为整数（number 或十进制字符串，字符串承载 >2^53 的精确 i64）。
 *
 * 行为：`dlopen` 装载 → 按符号名解析 → Win64 C 调用约定以 i64 实参调用 → 取 i64 返回，
 * stdout 输出 JSON：
 * - 成功：`{ "ok": true, "result": "<十进制字符串>" }`（i64 用十进制文本承载，避免 JSON 丢精度）；
 * - 结构化失败：`{ "ok": false, "stage": "abi" | "load" | "symbol" | "call", "error": "..." }`；
 * - 调用期进程崩溃（guest panic / 访问违例）不会产生 JSON，消费者以异常退出码终止，
 *   由 runner 侧按进程崩溃归类。
 *
 * 退出前显式 `dlclose`（`lib.close()`），不依赖进程退出隐式卸载。
 */
import { dlopen, FFIType } from 'bun:ffi';
import { readFileSync } from 'node:fs';

type ConsumerInput = {
    dllPath: string;
    symbol: string;
    args: (number | string)[];
    returns: string;
};

function emit(payload: Record<string, unknown>): void {
    process.stdout.write(JSON.stringify(payload));
    process.exit(0);
}

function fail(stage: 'abi' | 'load' | 'symbol' | 'call', message: string): never {
    emit({ ok: false, stage, error: message });
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
    || !Array.isArray(input.args)) {
    fail('abi', '输入信封缺少 dllPath/symbol/args 字段');
}
// 当前 C ABI 合同只闭合 i64 标量返回；其它返回载体（bool/文本/数组）未定案。
if (input.returns !== 'i64') {
    fail('abi', `返回载体 ${JSON.stringify(input.returns)} 不在已定案的 C ABI i64 标量合同内`);
}

const signature: Record<string, { args: FFIType[]; returns: FFIType }> = {
    [input.symbol]: {
        args: input.args.map(() => FFIType.i64),
        returns: FFIType.i64,
    },
};

let lib: ReturnType<typeof dlopen>;
try {
    lib = dlopen(input.dllPath, signature);
} catch (error) {
    fail('load', `dlopen 失败：${error instanceof Error ? error.message : String(error)}`);
}

const fn = lib.symbols[input.symbol] as ((...args: bigint[]) => bigint) | undefined;
if (fn === undefined) {
    try {
        lib.close();
    } catch {
        // 符号缺失时卸载失败不掩盖主因。
    }
    fail('symbol', `符号解析失败：${input.symbol}`);
}

const argv: bigint[] = [];
for (const [position, value] of input.args.entries()) {
    if (typeof value === 'number') {
        if (!Number.isSafeInteger(value)) {
            fail('abi', `args[${position}] 数值 ${value} 超出安全整数范围，无法无损送进 i64`);
        }
        argv.push(BigInt(value));
        continue;
    }
    if (typeof value === 'string' && /^-?\d+$/.test(value)) {
        argv.push(BigInt(value));
        continue;
    }
    fail('abi', `args[${position}] 不是整数标量载体：${JSON.stringify(value)}`);
}

try {
    const result = fn(...argv);
    const text = BigInt(result).toString();
    lib.close();
    emit({ ok: true, result: text });
} catch (error) {
    try {
        lib.close();
    } catch {
        // 调用失败时卸载失败不掩盖主因。
    }
    fail('call', `C 调用抛出：${error instanceof Error ? error.message : String(error)}`);
}

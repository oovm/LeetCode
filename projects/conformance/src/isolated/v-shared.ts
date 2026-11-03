/**
 * V wasm lane 的 ABI 辅助：与 `scripts/run_v_solver.ts` 内同语义，
 * 抽出供隔离子进程（实际值规整）与判题进程（期望值规整）共用。
 */
import { coerceIntegerArgument, I64_MAX, I64_MIN, integerResultText } from '../domain/integer-literal.ts';
import type { AbiExport, AbiParameter, LibraryInvokeSchema, WasmAbiType } from '../adapters/valkyrie-node/abi.ts';

export type AbiLookup = {
    exportSymbol: string;
    exportSchema: AbiExport;
};

/** 从 ABI schema 中找到 invoke 入口对应的 export 声明；找不到即结构化失败。 */
export function lookupAbiExport(schema: LibraryInvokeSchema, entry: string, exportSymbol: string): AbiLookup {
    const exportSchema = schema.exports[exportSymbol];
    if (!exportSchema) {
        const available = Object.keys(schema.exports);
        throw new Error(
            `ABI schema 里找不到 export "${exportSymbol}"（来自 entry "${entry}"）。` +
                `schema 里已注册的 export: ${available.join(', ') || '(none)'}`,
        );
    }
    return { exportSymbol, exportSchema };
}

/**
 * `i64` 参数以十进制字符串交给 node glue：`bigint`/安全整数/十进制字符串统一规整，
 * 越出 `[i64::MIN, i64::MAX]` 抛结构化错误，绝不静默截断。
 */
export function preserveI64Precision(param: AbiParameter, value: unknown): unknown {
    if (param.type.kind !== 'I64') {
        return value;
    }
    return coerceIntegerArgument(value, I64_MIN, I64_MAX, `args.${param.name}`) ?? value;
}

/**
 * 按 ABI 返回类型把整数结果（含数组元素）规整为精确十进制文本；
 * 其余类型（`Utf8`、`Bool` 等）保持原值按结构比较。
 */
export function normalizeResultByAbiType(value: unknown, type: WasmAbiType): unknown {
    if (type.kind === 'I64' || type.kind === 'I32') {
        return integerResultText(value) ?? value;
    }
    if ((type.kind === 'Array' || type.kind === 'FixedArray') && Array.isArray(value)) {
        return value.map((item) => normalizeResultByAbiType(item, type.element));
    }
    return value;
}

/**
 * V wasm lane 的 ABI 辅助：参数规整与返回值规整的唯一定义。
 * 判题进程（`scripts/run_v_solver.ts`）与隔离子进程（`child-valkyrie-wasm.ts`）
 * 都从这里取，禁止在任一侧复制第二套 marshal 规则。
 */
import { coerceIntegerArgument, I64_MAX, I64_MIN, integerResultText } from '../domain/integer-literal.ts';
import type { AbiExport, LibraryInvokeSchema, WasmAbiType } from '../adapters/valkyrie-node/abi.ts';

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
 *
 * 必须按 ABI 类型递归：`ArrayList<i64>` 在 schema 里是 `Array<I64>`，glue 拒绝
 * 元素为 `Number`（只接受 `BigInt` 或十进制字符串），只在顶层标量转换会让
 * 数组实参在 `arg0[0]` 处被 marshal 拦住。
 */
export function preserveI64Precision(type: WasmAbiType, value: unknown, path: string): unknown {
    if (type.kind === 'I64') {
        return coerceIntegerArgument(value, I64_MIN, I64_MAX, path) ?? value;
    }
    if ((type.kind === 'Array' || type.kind === 'FixedArray') && Array.isArray(value)) {
        return value.map((item, index) => preserveI64Precision(type.element, item, `${path}[${index}]`));
    }
    if (type.kind === 'Option' && value !== null && value !== undefined) {
        return preserveI64Precision(type.inner, value, path);
    }
    if (type.kind === 'Tuple' && Array.isArray(value)) {
        return value.map((item, index) => {
            const field = type.fields[index];
            return field ? preserveI64Precision(field, item, `${path}[${index}]`) : item;
        });
    }
    return value;
}

/**
 * 按 ABI 返回类型把整数结果（含数组元素）规整为精确十进制文本；
 * 其余类型（`Utf8`、`Bool` 等）保持原值按结构比较。
 *
 * `Option` 只递归负载：`null` 是 `None` 的 wire 形状，原样保留；
 * 否则 `Option<Array<I64>>` 的元素会是 `BigInt`，直接 `JSON.stringify` 会抛错。
 */
export function normalizeResultByAbiType(value: unknown, type: WasmAbiType): unknown {
    if (type.kind === 'I64' || type.kind === 'I32') {
        return integerResultText(value) ?? value;
    }
    if ((type.kind === 'Array' || type.kind === 'FixedArray') && Array.isArray(value)) {
        return value.map((item) => normalizeResultByAbiType(item, type.element));
    }
    if (type.kind === 'Option') {
        return value === null || value === undefined ? value : normalizeResultByAbiType(value, type.inner);
    }
    if (type.kind === 'Tuple' && Array.isArray(value)) {
        return value.map((item, index) => {
            const field = type.fields[index];
            return field ? normalizeResultByAbiType(item, field) : item;
        });
    }
    return value;
}

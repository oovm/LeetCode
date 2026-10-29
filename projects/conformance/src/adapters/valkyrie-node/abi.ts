/**
 * ABI schema 消费：从 wasm binary 自定义 section `nyar.library_invoke`
 * 读取 nyar-vm.rs 产出的权威 ABI JSON，按结构化 `WasmAbiType` 做 marshal/unmarshal。
 *
 * 设计原则：
 * - 唯一事实来源是 emitter 的 `{version, exports, glue_entries, abi_digest}`
 * - 参数顺序由 schema 的 `params[index]` 决定，metadata 只按 `name` 供货；不依赖 metadata 键序
 * - 每个参数以 `{index, name, type, carrier}` 身份声明，`type` 是 marshal 权威，`carrier` 仅用于身份与展示
 * - glue 查找按 `module_path + name + generic_args` 的完整 aggregate 身份，
 *   与 emitter 的 registry 查询同构；禁止只按简单名匹配、禁止默认 carrier
 * - 未知 kind、缺 `abi_digest`、参数身份不完整一律抛结构化错误，不静默 fallback
 */

// ── 类型定义 ───────────────────────────────────────────────────────────────────

/** 标量 kind：Wasm 直接可表示的 ABI 类型（`Unit` 表示 void 返回）。 */
export type AbiScalarKind = 'Unit' | 'I32' | 'I64' | 'F32' | 'F64' | 'Bool' | 'Char' | 'Utf8';

/** `NamedAggregate`：带语义身份的 nominal / generic aggregate。 */
export interface AbiNamedAggregateType {
    kind: 'NamedAggregate';
    name: string;
    module_path: string;
    generic_args: WasmAbiType[];
}

/** 结构化 ABI 类型判别联合，对应 emitter 的 `WasmAbiType`。 */
export type WasmAbiType =
    | { kind: 'Unit' }
    | { kind: 'I32' }
    | { kind: 'I64' }
    | { kind: 'F32' }
    | { kind: 'F64' }
    | { kind: 'Bool' }
    | { kind: 'Char' }
    | { kind: 'Utf8' }
    | { kind: 'Array'; element: WasmAbiType }
    | { kind: 'FixedArray'; element: WasmAbiType; length: number }
    | { kind: 'Option'; inner: WasmAbiType }
    | { kind: 'Tuple'; fields: WasmAbiType[] }
    | AbiNamedAggregateType
    | { kind: 'Unsupported'; reason: string };

/** 单个参数的 ABI 身份：`index` 决定位置，`name` 供 metadata 按名供货。 */
export interface AbiParameter {
    /** 声明顺序（0 起、连续、唯一）；解析后按此升序归一。 */
    index: number;
    /** 编译期参数名；metadata.tests.args 按此键取值。 */
    name: string;
    /** marshal 的权威类型。 */
    type: WasmAbiType;
    /** 物理载体字符串（i32/i64/f32/f64/handle/void 等），仅用于身份与展示。 */
    carrier: string;
}

/** Schema 里单个导出的 ABI（Valkyrie 当前单返回）。 */
export interface AbiExport {
    /** 参数身份列表；顺序由 `index` 决定，metadata 只按名字供货。 */
    params: AbiParameter[];
    returns: WasmAbiType;
}

/** glue operation 的 carrier 描述。 */
export interface AbiGlueOperation {
    operation: string;
    export_name: string;
    param_carriers: string[];
    return_carrier: string;
    export_source?: string;
}

/** `glue_entries` 里单个 aggregate 的语义身份与序列 helper 操作。 */
export interface AbiGlueEntry {
    kind?: 'NamedAggregate';
    name: string;
    module_path: string;
    generic_args: WasmAbiType[];
    operations: AbiGlueOperation[];
    source?: string;
    status?: string;
}

/** `nyar.library_invoke` section 的 JSON 根结构。 */
export interface LibraryInvokeSchema {
    version: 0;
    /** key = wasm export 公开名。 */
    exports: Record<string, AbiExport>;
    glue_entries: AbiGlueEntry[];
    abi_digest: string;
}

/** 结构化 ABI 错误码，便于调用方按类别处理。 */
export type AbiSchemaErrorCode =
    | 'missing_section'
    | 'invalid_json'
    | 'invalid_root'
    | 'unsupported_version'
    | 'missing_abi_digest'
    | 'missing_exports'
    | 'missing_glue_entries'
    | 'invalid_type'
    | 'invalid_param_index'
    | 'duplicate_param_identity'
    | 'missing_argument'
    | 'unknown_argument'
    | 'unknown_kind'
    | 'invalid_glue_entry'
    | 'glue_entry_not_found'
    | 'glue_operation_missing'
    | 'invalid_carrier'
    | 'unsupported_value';

/** 带错误码与 JSON 路径的结构化 ABI 错误。 */
export class AbiSchemaError extends Error {
    readonly code: AbiSchemaErrorCode;
    readonly path: string;

    constructor(code: AbiSchemaErrorCode, path: string, message: string) {
        super(`${path}: ${message}`);
        this.name = 'AbiSchemaError';
        this.code = code;
        this.path = path;
    }
}

// ── wasm custom section 解析 ───────────────────────────────────────────────────

const CUSTOM_SECTION_ID = 0;
const LIBRARY_INVOKE_SECTION_NAME = 'nyar.library_invoke';
const SCHEMA_VERSION = 0;

/**
 * 最小 leb128 无符号解码（wasm section header 用）。
 * 返回 [value, bytesConsumed]。
 */
function decodeLeb128U(bytes: Uint8Array, offset: number): [number, number] {
    let result = 0;
    let shift = 0;
    let consumed = 0;
    while (true) {
        if (offset + consumed >= bytes.length) {
            throw new Error(`leb128 解码越界（offset=${offset}）`);
        }
        const byte = bytes[offset + consumed]!;
        consumed += 1;
        result |= (byte & 0x7f) << shift;
        if ((byte & 0x80) === 0) break;
        shift += 7;
        if (shift > 35) {
            throw new Error(`leb128 解码溢出（offset=${offset}）`);
        }
    }
    return [result, consumed];
}

/** 校验 wasm 魔术头 + version 段。 */
function assertWasmMagic(bytes: Uint8Array): void {
    if (bytes.length < 8) {
        throw new Error(`wasm binary 太短（${bytes.length} bytes）`);
    }
    const magic = bytes.subarray(0, 4);
    const expected = [0x00, 0x61, 0x73, 0x6d];
    for (let i = 0; i < 4; i += 1) {
        if (magic[i] !== expected[i]) {
            throw new Error(`不是合法 wasm binary（magic=${Array.from(magic).join(',')}）`);
        }
    }
    // version 段跳过
}

/** 从 wasm bytes 中提取命名 custom section 的 UTF-8 内容。找不到返回 null。 */
function readCustomSection(bytes: Uint8Array, sectionName: string): string | null {
    assertWasmMagic(bytes);

    let pos = 8; // 跳过 magic + version
    while (pos < bytes.length) {
        if (pos >= bytes.length) break;
        const sectionId = bytes[pos]!;
        pos += 1;
        const [sectionSize, sizeConsumed] = decodeLeb128U(bytes, pos);
        pos += sizeConsumed;
        const sectionStart = pos;
        const sectionEnd = pos + sectionSize;

        if (sectionId === CUSTOM_SECTION_ID) {
            // custom section 内部：name_len(leb128) + name + payload
            const [nameLen, nameLenConsumed] = decodeLeb128U(bytes, sectionStart);
            const nameStart = sectionStart + nameLenConsumed;
            const nameBytes = bytes.subarray(nameStart, nameStart + nameLen);
            const nameText = new TextDecoder('utf-8').decode(nameBytes);
            if (nameText === sectionName) {
                const payloadStart = nameStart + nameLen;
                const payloadBytes = bytes.subarray(payloadStart, sectionEnd);
                return new TextDecoder('utf-8').decode(payloadBytes);
            }
        }

        pos = sectionEnd;
    }
    return null;
}

// ── 公开加载入口 ──────────────────────────────────────────────────────────────

/**
 * 从 wasm artifact 的自定义 section `nyar.library_invoke` 加载 ABI schema。
 *
 * section 不存在时抛结构化错误，**不兜底**。
 */
export function loadLibraryInvokeSchema(wasmBytes: Uint8Array): LibraryInvokeSchema {
    const jsonText = readCustomSection(wasmBytes, LIBRARY_INVOKE_SECTION_NAME);
    if (!jsonText) {
        throw new AbiSchemaError(
            'missing_section',
            LIBRARY_INVOKE_SECTION_NAME,
            'wasm artifact 缺少 custom section。上游 emitter 必须产出 {version, exports, glue_entries, abi_digest}，' +
                'harness 不按 metadata 键序兜底。',
        );
    }
    return parseLibraryInvokeSchema(jsonText);
}

/** 解析并校验 `nyar.library_invoke` section 的 JSON 文本。 */
export function parseLibraryInvokeSchema(jsonText: string): LibraryInvokeSchema {
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonText) as unknown;
    } catch (err) {
        throw new AbiSchemaError('invalid_json', LIBRARY_INVOKE_SECTION_NAME, `section 不是合法 JSON: ${String(err)}`);
    }
    return validateSchema(parsed);
}

// ── schema 校验 ───────────────────────────────────────────────────────────────

function validateSchema(raw: unknown): LibraryInvokeSchema {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_root', '$', 'ABI schema 根必须是 object');
    }
    const root = raw as Record<string, unknown>;

    if (root.version !== SCHEMA_VERSION) {
        throw new AbiSchemaError(
            'unsupported_version',
            '$.version',
            `ABI schema version 必须为 ${SCHEMA_VERSION}（实际 ${JSON.stringify(root.version)}）`,
        );
    }
    if (typeof root.abi_digest !== 'string' || root.abi_digest.trim().length === 0) {
        throw new AbiSchemaError('missing_abi_digest', '$.abi_digest', 'ABI schema 缺少非空字符串 abi_digest');
    }
    if (typeof root.exports !== 'object' || root.exports === null || Array.isArray(root.exports)) {
        throw new AbiSchemaError('missing_exports', '$.exports', 'ABI schema 缺少 exports 对象');
    }
    if (!Array.isArray(root.glue_entries)) {
        throw new AbiSchemaError('missing_glue_entries', '$.glue_entries', 'ABI schema 缺少 glue_entries 数组');
    }

    const exports: Record<string, AbiExport> = {};
    for (const [exportSymbol, rawExport] of Object.entries(root.exports as Record<string, unknown>)) {
        exports[exportSymbol] = validateExport(exportSymbol, rawExport);
    }

    const glue_entries = root.glue_entries.map((entry, index) => validateGlueEntry(`$.glue_entries[${index}]`, entry));

    return { version: SCHEMA_VERSION, exports, glue_entries, abi_digest: root.abi_digest };
}

function validateExport(exportSymbol: string, raw: unknown): AbiExport {
    const path = `$.exports.${exportSymbol}`;
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_type', path, 'export 必须是 object');
    }
    const obj = raw as Record<string, unknown>;
    if (!Array.isArray(obj.params)) {
        throw new AbiSchemaError('invalid_type', `${path}.params`, 'export 缺少 params 数组');
    }
    const params = validateParams(`${path}.params`, obj.params);
    if (!Object.hasOwn(obj, 'returns')) {
        throw new AbiSchemaError('invalid_type', `${path}.returns`, 'export 缺少 returns');
    }
    return { params, returns: validateType(`${path}.returns`, obj.returns) };
}

/**
 * 解析并校验 `params` 参数身份数组。
 *
 * 合同：每个参数是 `{index, name, type, carrier}`；`index` 从 0 连续到 n-1（顺序任意，解析后按 index 升序归一），
 * `name` 非空且唯一，`type` 走 `validateType`，`carrier` 非空字符串。
 */
function validateParams(path: string, raw: unknown[]): AbiParameter[] {
    const params = raw.map((param, position) => validateParameter(`${path}[${position}]`, param));

    const seenIndices = new Set<number>();
    for (const param of params) {
        if (seenIndices.has(param.index)) {
            throw new AbiSchemaError('invalid_param_index', `${path}[${param.index}].index`, `参数 index ${param.index} 重复`);
        }
        seenIndices.add(param.index);
    }

    const normalized = [...params].sort((left, right) => left.index - right.index);
    normalized.forEach((param, position) => {
        if (param.index !== position) {
            throw new AbiSchemaError(
                'invalid_param_index',
                `${path}[${param.index}].index`,
                `参数 index 必须从 0 连续到 ${normalized.length - 1}（缺少 index ${position}）`,
            );
        }
    });

    const seenNames = new Set<string>();
    for (const param of normalized) {
        if (seenNames.has(param.name)) {
            throw new AbiSchemaError('duplicate_param_identity', `${path}[${param.index}].name`, `参数名 "${param.name}" 重复`);
        }
        seenNames.add(param.name);
    }

    return normalized;
}

function validateParameter(path: string, raw: unknown): AbiParameter {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_type', path, '参数必须是 {index, name, type, carrier} object');
    }
    const obj = raw as Record<string, unknown>;
    if (typeof obj.index !== 'number' || !Number.isInteger(obj.index) || obj.index < 0) {
        throw new AbiSchemaError('invalid_param_index', `${path}.index`, '参数缺少非负整数 index');
    }
    if (typeof obj.name !== 'string' || obj.name.length === 0) {
        throw new AbiSchemaError('invalid_type', `${path}.name`, '参数缺少非空字符串 name');
    }
    if (typeof obj.carrier !== 'string' || obj.carrier.length === 0) {
        throw new AbiSchemaError('invalid_carrier', `${path}.carrier`, '参数缺少非空字符串 carrier');
    }
    return {
        index: obj.index,
        name: obj.name,
        type: validateType(`${path}.type`, obj.type),
        carrier: obj.carrier,
    };
}

function validateGlueEntry(path: string, raw: unknown): AbiGlueEntry {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_glue_entry', path, 'glue entry 必须是 object');
    }
    const obj = raw as Record<string, unknown>;
    if (obj.kind !== undefined && obj.kind !== 'NamedAggregate') {
        throw new AbiSchemaError(
            'invalid_glue_entry',
            `${path}.kind`,
            `glue entry kind 只支持 "NamedAggregate"（实际 ${JSON.stringify(obj.kind)}）`,
        );
    }
    if (typeof obj.name !== 'string' || obj.name.length === 0) {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.name`, 'glue entry 缺少非空 name');
    }
    if (typeof obj.module_path !== 'string') {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.module_path`, 'glue entry 缺少字符串 module_path');
    }
    if (!Array.isArray(obj.generic_args)) {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.generic_args`, 'glue entry 缺少 generic_args 数组');
    }
    if (!Array.isArray(obj.operations)) {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.operations`, 'glue entry 缺少 operations 数组');
    }

    const generic_args = obj.generic_args.map((arg, index) => validateType(`${path}.generic_args[${index}]`, arg));
    const operations = obj.operations.map((operation, index) => validateGlueOperation(`${path}.operations[${index}]`, operation));

    return {
        ...(obj.kind === 'NamedAggregate' ? { kind: 'NamedAggregate' as const } : {}),
        name: obj.name,
        module_path: obj.module_path,
        generic_args,
        operations,
        ...(typeof obj.source === 'string' ? { source: obj.source } : {}),
        ...(typeof obj.status === 'string' ? { status: obj.status } : {}),
    };
}

function validateGlueOperation(path: string, raw: unknown): AbiGlueOperation {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_glue_entry', path, 'operation 必须是 object');
    }
    const obj = raw as Record<string, unknown>;
    if (typeof obj.operation !== 'string' || obj.operation.length === 0) {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.operation`, 'operation 缺少非空 operation 名');
    }
    if (typeof obj.export_name !== 'string') {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.export_name`, 'operation 缺少字符串 export_name');
    }
    if (!Array.isArray(obj.param_carriers) || obj.param_carriers.some((carrier) => typeof carrier !== 'string')) {
        throw new AbiSchemaError(
            'invalid_glue_entry',
            `${path}.param_carriers`,
            'operation 缺少 param_carriers 字符串数组（不允许默认 carrier）',
        );
    }
    if (typeof obj.return_carrier !== 'string' || obj.return_carrier.length === 0) {
        throw new AbiSchemaError('invalid_glue_entry', `${path}.return_carrier`, 'operation 缺少非空 return_carrier（不允许默认 carrier）');
    }
    return {
        operation: obj.operation,
        export_name: obj.export_name,
        param_carriers: obj.param_carriers as string[],
        return_carrier: obj.return_carrier,
        ...(typeof obj.export_source === 'string' ? { export_source: obj.export_source } : {}),
    };
}

/** 校验结构化 `WasmAbiType`；未知 kind 直接抛错。 */
function validateType(path: string, raw: unknown): WasmAbiType {
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new AbiSchemaError('invalid_type', path, 'WasmAbiType 必须是 object');
    }
    const obj = raw as Record<string, unknown>;
    const kind = obj.kind;
    if (typeof kind !== 'string') {
        throw new AbiSchemaError('invalid_type', `${path}.kind`, 'WasmAbiType 缺少字符串 kind');
    }

    switch (kind) {
        case 'Unit':
        case 'I32':
        case 'I64':
        case 'F32':
        case 'F64':
        case 'Bool':
        case 'Char':
        case 'Utf8':
            return { kind };
        case 'Array':
            return { kind: 'Array', element: validateType(`${path}.element`, obj.element) };
        case 'FixedArray': {
            if (typeof obj.length !== 'number' || !Number.isInteger(obj.length) || obj.length < 0) {
                throw new AbiSchemaError('invalid_type', `${path}.length`, 'FixedArray 缺少非负整数 length');
            }
            return {
                kind: 'FixedArray',
                element: validateType(`${path}.element`, obj.element),
                length: obj.length,
            };
        }
        case 'Option':
            return { kind: 'Option', inner: validateType(`${path}.inner`, obj.inner) };
        case 'Tuple': {
            if (!Array.isArray(obj.fields)) {
                throw new AbiSchemaError('invalid_type', `${path}.fields`, 'Tuple 缺少 fields 数组');
            }
            return {
                kind: 'Tuple',
                fields: obj.fields.map((field, index) => validateType(`${path}.fields[${index}]`, field)),
            };
        }
        case 'NamedAggregate': {
            if (typeof obj.name !== 'string' || obj.name.length === 0) {
                throw new AbiSchemaError('invalid_type', `${path}.name`, 'NamedAggregate 缺少非空 name');
            }
            if (typeof obj.module_path !== 'string') {
                throw new AbiSchemaError('invalid_type', `${path}.module_path`, 'NamedAggregate 缺少字符串 module_path');
            }
            if (!Array.isArray(obj.generic_args)) {
                throw new AbiSchemaError('invalid_type', `${path}.generic_args`, 'NamedAggregate 缺少 generic_args 数组');
            }
            return {
                kind: 'NamedAggregate',
                name: obj.name,
                module_path: obj.module_path,
                generic_args: obj.generic_args.map((arg, index) => validateType(`${path}.generic_args[${index}]`, arg)),
            };
        }
        case 'Unsupported': {
            if (typeof obj.reason !== 'string') {
                throw new AbiSchemaError('invalid_type', `${path}.reason`, 'Unsupported 缺少字符串 reason');
            }
            return { kind: 'Unsupported', reason: obj.reason };
        }
        default:
            throw new AbiSchemaError('unknown_kind', `${path}.kind`, `未知 WasmAbiType kind "${kind}"`);
    }
}

// ── glue registry 查找 ────────────────────────────────────────────────────────

/**
 * 按 `kind + module_path + name + generic_args` 查找 glue entry。
 *
 * 与 emitter 的 registry 查询同构：module_path 精确比较，generic_args 结构化比较。
 * 只按简单名匹配会混淆不同命名空间/泛型实例，因此这里一律拒绝。
 */
export function findGlueEntry(
    schema: LibraryInvokeSchema,
    aggregate: Pick<AbiNamedAggregateType, 'name' | 'module_path' | 'generic_args'>,
): AbiGlueEntry {
    const found = schema.glue_entries.find(
        (entry) =>
            entry.name === aggregate.name &&
            entry.module_path === aggregate.module_path &&
            sameAbiTypes(entry.generic_args, aggregate.generic_args),
    );
    if (!found) {
        throw new AbiSchemaError(
            'glue_entry_not_found',
            '$.glue_entries',
            `找不到 aggregate ${aggregate.module_path}.${aggregate.name}<${describeTypes(aggregate.generic_args)}> 的 glue entry`,
        );
    }
    return found;
}

function sameAbiTypes(left: WasmAbiType[], right: WasmAbiType[]): boolean {
    return left.length === right.length && left.every((type, index) => JSON.stringify(type) === JSON.stringify(right[index]));
}

function describeTypes(types: WasmAbiType[]): string {
    return types.map((type) => type.kind).join(',');
}

// ── 参数位置展开 ──────────────────────────────────────────────────────────────

/**
 * 按 schema 的参数身份把 metadata.tests.args 展开成位置参数。
 *
 * 只做身份校验与位置排序：位置由 `index` 升序决定，取值只按 `name` 查；
 * 缺参数、多出未声明参数一律抛结构化错误。
 *
 * 值的 marshal/unmarshal 由产物自带的 node glue（`callExport`）按同一份
 * `nyar.library_invoke` schema 完成，harness 不再维护第二套 ABI 桥。
 */
export function orderArgsBySchema(exportSchema: AbiExport, args: Record<string, unknown>): unknown[] {
    const declaredNames = new Set<string>();
    for (const param of exportSchema.params) {
        declaredNames.add(param.name);
        if (!Object.hasOwn(args, param.name)) {
            throw new AbiSchemaError('missing_argument', `args.${param.name}`, `metadata.tests.args 缺少参数 "${param.name}"`);
        }
    }
    for (const key of Object.keys(args)) {
        if (!declaredNames.has(key)) {
            throw new AbiSchemaError('unknown_argument', `args.${key}`, `metadata.tests.args 含 schema 未声明的参数 "${key}"`);
        }
    }
    return [...exportSchema.params]
        .sort((left, right) => left.index - right.index)
        .map((param) => args[param.name]);
}

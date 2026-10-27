/**
 * ABI schema 消费：从 wasm binary 自定义 section `nyar.library_invoke`
 * 读取 JSON schema，按 schema 的 params/returns 顺序和类型做 marshal/unmarshal。
 *
 * 设计原则：
 * - 参数顺序 **严格来自 schema**，不使用 `Object.values(args)` 的隐式键序
 * - 找不到 section 时直接抛错，**不做**兜底猜测（架构师禁令：不能把参数顺序交给 JS 对象布局）
 * - 第一阶段只实现 i32/i64/f64/bool/string 标量；ArrayList/HashMap 等容器类型留 TODO
 */

// ── 类型定义 ───────────────────────────────────────────────────────────────────

/**
 * 标量类型 token（schema JSON 里 type 字段的合法值）。
 * 第一阶段只覆盖 wasm 直接可表示的基础类型。
 */
export type PrimitiveType = 'i32' | 'i64' | 'f32' | 'f64' | 'bool' | 'string';

/**
 * 类型描述：schema 里一个 param 或 return 的 type 字段。
 * 第一阶段只识别 PrimitiveType，其余一律抛错 + TODO。
 */
export type AbiType = PrimitiveType;

/** Schema 里单个参数。 */
export interface AbiParam {
    name: string;
    type: AbiType;
}

/** Schema 里单个返回值（Valkyrie 当前单返回）。 */
export interface AbiReturn {
    type: AbiType;
}

/** 单个可调用入口的 ABI。 */
export interface AbiInvoke {
    /** 与 wasm export symbol 同名（通常是方法名，如 twoSum）。 */
    export: string;
    /** 参数 **按声明顺序**（不是按 metadata.tests 的键序）。 */
    params: AbiParam[];
    returns: AbiReturn | null;
}

/** `nyar.library_invoke` section 的 JSON 根结构。 */
export interface LibraryInvokeSchema {
    /** 将来可能演进。当前固定 1。 */
    version: number;
    /** key = export symbol。 */
    invokes: Record<string, AbiInvoke>;
}

// ── wasm custom section 解析 ───────────────────────────────────────────────────

const CUSTOM_SECTION_ID = 0;
const LIBRARY_INVOKE_SECTION_NAME = 'nyar.library_invoke';

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
 * section 尚不存在（emitter 侧 Stream A 未产出）时抛 Error，**不兜底**。
 * 调用方应把错误信息原样报告出来，提示上游补 section。
 */
export function loadLibraryInvokeSchema(wasmBytes: Uint8Array): LibraryInvokeSchema {
    const jsonText = readCustomSection(wasmBytes, LIBRARY_INVOKE_SECTION_NAME);
    if (!jsonText) {
        // TODO: emitter 侧 nyar-emitter 产出 nyar.library_invoke section 后，此处应该能读到
        // 暂时强制失败，逼上游补能力；绝对不能 Object.values 兜底
        throw new Error(
            `wasm artifact 缺少 custom section "${LIBRARY_INVOKE_SECTION_NAME}"。` +
            `上游 nyar-emitter（Stream A）尚未产出 ABI schema。` +
            `harness 侧不做 Object.values 兜底——请先让 emitter 把 params/returns 顺序写进 wasm。`,
        );
    }
    let parsed: unknown;
    try {
        parsed = JSON.parse(jsonText) as unknown;
    } catch (err) {
        throw new Error(
            `"${LIBRARY_INVOKE_SECTION_NAME}" section 不是合法 JSON: ${String(err)}`,
        );
    }
    return validateSchema(parsed);
}

// ── schema 校验 ───────────────────────────────────────────────────────────────

const VALID_PRIMITIVES = new Set<string>(['i32', 'i64', 'f32', 'f64', 'bool', 'string']);

function validateSchema(raw: unknown): LibraryInvokeSchema {
    if (typeof raw !== 'object' || raw === null) {
        throw new Error('ABI schema 根必须是 object');
    }
    const root = raw as Record<string, unknown>;
    if (typeof root.version !== 'number') {
        throw new Error('ABI schema 缺少数字 version 字段');
    }
    if (typeof root.invokes !== 'object' || root.invokes === null) {
        throw new Error('ABI schema 缺少 invokes 字段');
    }
    const invokes: Record<string, AbiInvoke> = {};
    for (const [exportSymbol, rawInvoke] of Object.entries(root.invokes as Record<string, unknown>)) {
        invokes[exportSymbol] = validateInvoke(exportSymbol, rawInvoke);
    }
    return { version: root.version, invokes };
}

function validateInvoke(exportSymbol: string, raw: unknown): AbiInvoke {
    if (typeof raw !== 'object' || raw === null) {
        throw new Error(`invokes.${exportSymbol} 必须是 object`);
    }
    const obj = raw as Record<string, unknown>;
    const export_ = typeof obj.export === 'string' ? obj.export : exportSymbol;
    const paramsRaw = obj.params;
    if (!Array.isArray(paramsRaw)) {
        throw new Error(`invokes.${exportSymbol} 缺少 params 数组`);
    }
    const params: AbiParam[] = paramsRaw.map((p, i) => validateParam(exportSymbol, i, p));
    const returnsRaw = obj.returns;
    const returns = returnsRaw === null || returnsRaw === undefined
        ? null
        : validateReturn(exportSymbol, returnsRaw);
    return { export: export_, params, returns };
}

function validateParam(exportSymbol: string, index: number, raw: unknown): AbiParam {
    if (typeof raw !== 'object' || raw === null) {
        throw new Error(`invokes.${exportSymbol}.params[${index}] 必须是 object`);
    }
    const obj = raw as Record<string, unknown>;
    if (typeof obj.name !== 'string') {
        throw new Error(`invokes.${exportSymbol}.params[${index}] 缺少 name`);
    }
    const type = validateType(exportSymbol, `params[${index}]`, obj.type);
    return { name: obj.name, type };
}

function validateReturn(exportSymbol: string, raw: unknown): AbiReturn {
    if (typeof raw !== 'object' || raw === null) {
        throw new Error(`invokes.${exportSymbol}.returns 必须是 object`);
    }
    const obj = raw as Record<string, unknown>;
    const type = validateType(exportSymbol, 'returns', obj.type);
    return { type };
}

function validateType(exportSymbol: string, where: string, raw: unknown): AbiType {
    if (typeof raw !== 'string') {
        throw new Error(`invokes.${exportSymbol}.${where}.type 必须是 string`);
    }
    if (VALID_PRIMITIVES.has(raw)) {
        return raw as PrimitiveType;
    }
    // TODO: ArrayList<T>、HashMap<K,V>、nullable、T[] 等容器类型后续由 emitter 产出后再补
    throw new Error(
        `invokes.${exportSymbol}.${where}.type = "${raw}" 暂未实现。` +
        `第一阶段只支持 ${Array.from(VALID_PRIMITIVES).join(', ')}。` +
        `容器类型等 emitter 侧补完整 schema 后在本文件 marshal/unmarshal 里跟进。`,
    );
}

// ── marshal: 按 schema 顺序 + 类型把 Record<string, unknown> 转成参数序列 ────

/**
 * 把 metadata.tests 里的 args（键名 → 值）按 schema 里 params 的**声明顺序**
 * 展开成位置参数数组。不使用 Object.values。
 *
 * 类型处理：
 * - i64 用 BigInt（JS number 在 ±2^53 外会丢精度，metadata 里出现 1e10 量级整数）
 * - 其余标量直接透传
 */
export function marshalArgsBySchema(
    schema: AbiInvoke,
    args: Record<string, unknown>,
): unknown[] {
    const out: unknown[] = [];
    for (const param of schema.params) {
        const raw = args[param.name];
        if (raw === undefined) {
            throw new Error(
                `schema 声明了参数 "${param.name}"，但 metadata.tests.args 里找不到这个键。` +
                `schema 与 metadata 不一致。`,
            );
        }
        out.push(marshalPrimitive(param.type, raw, param.name));
    }
    return out;
}

function marshalPrimitive(type: AbiType, raw: unknown, name: string): unknown {
    switch (type) {
        case 'i64':
        case 'f32':
        case 'f64': {
            if (typeof raw === 'bigint') return raw;
            if (typeof raw === 'number') {
                // i64: 整数安全则转 BigInt，避免精度丢
                // f32/f64: 直接透传 number
                if (type === 'i64') {
                    if (!Number.isFinite(raw)) {
                        throw new Error(`参数 "${name}" 需要 i64，但拿到了非有限值 ${raw}`);
                    }
                    // 超出安全整数范围也转 BigInt
                    return BigInt(Math.trunc(raw));
                }
                return raw;
            }
            throw new Error(`参数 "${name}" 需要 ${type}，但类型是 ${typeof raw}`);
        }
        case 'i32': {
            if (typeof raw === 'number') return raw | 0;
            throw new Error(`参数 "${name}" 需要 i32，但类型是 ${typeof raw}`);
        }
        case 'bool': {
            if (typeof raw === 'boolean') return raw;
            throw new Error(`参数 "${name}" 需要 bool，但类型是 ${typeof raw}`);
        }
        case 'string': {
            if (typeof raw === 'string') return raw;
            throw new Error(`参数 "${name}" 需要 string，但类型是 ${typeof raw}`);
        }
    }
}

// ── unmarshal: 按 schema.returns 把 callExport 返回值转成 JS 期望值 ────────────

/**
 * 把 wasm callExport 的返回值按 schema.returns 类型转成 JS。
 * 单返回值（当前 Valkyrie 约定），返回 null 表示 void。
 */
export function unmarshalReturnBySchema(
    schema: AbiInvoke,
    raw: unknown,
): unknown {
    if (!schema.returns) {
        // void 返回：callExport 可能返回 undefined 或 i32=0
        return raw === undefined || raw === null ? null : raw;
    }
    return unmarshalPrimitive(schema.returns.type, raw);
}

function unmarshalPrimitive(type: AbiType, raw: unknown): unknown {
    switch (type) {
        case 'i64': {
            // BigInt 转 string，避免后续 JSON stringify 丢精度
            if (typeof raw === 'bigint') return raw.toString();
            if (typeof raw === 'number') return BigInt(Math.trunc(raw)).toString();
            return raw;
        }
        case 'i32':
        case 'f32':
        case 'f64':
        case 'bool':
        case 'string': {
            return raw;
        }
    }
}

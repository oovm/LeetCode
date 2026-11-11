/**
 * 隔离判题的进程间协议：NDJSON over stdio，tagged 值编码。
 *
 * 设计约束：
 * - `bigint` 一律编码为 `{ $bigint: "<十进制文本>" }`，禁止 `JSON.stringify` 直接序列化
 *   （原生会对 bigint 抛 `TypeError`，对超安全整数 `number` 静默丢精度）。
 * - 整数值越过 `Number.MAX_SAFE_INTEGER` 的 `number` 在编码侧直接抛 `UnsafeNumberError`，
 *   不允许静默降级通过协议边界；承载大整数的合法形态是 `bigint`（TS 用例里的 `123n` 字面量）。
 * - `undefined` 编码为 `{ $undefined: true }`，避免 JSON 在数组位上丢洞。
 * - 非有限浮点（`NaN`/`Infinity`）拒绝编码；普通浮点原样通过（其精度语义与 JSON 语料一致）。
 */
import type { ObservationPhase } from '../observation/guest-trap.ts';

export const PROTOCOL_VERSION = 'ndjson-v1' as const;

const MAX_SAFE = 9007199254740991;

/** 协议值编码后的形态：只含可安全 `JSON.stringify` 的节点。 */
export type TaggedValue =
    | null
    | boolean
    | number
    | string
    | TaggedValue[]
    | { [key: string]: TaggedValue }
    | { $bigint: string }
    | { $undefined: true };

export class UnsafeNumberError extends Error {
    constructor(
        message: string,
        readonly path: string,
    ) {
        super(message);
        this.name = 'UnsafeNumberError';
    }
}

export class ProtocolDecodeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProtocolDecodeError';
    }
}

function encodeNumber(value: number, path: string): number {
    if (!Number.isFinite(value)) {
        throw new UnsafeNumberError(`${path}: 非有限浮点不允许进入判题协议（NaN/Infinity）`, path);
    }
    if (Number.isInteger(value) && Math.abs(value) > MAX_SAFE) {
        throw new UnsafeNumberError(
            `${path}: 整数值 ${value} 越过 Number.MAX_SAFE_INTEGER，必须改用 bigint 字面量（如 ${Math.trunc(value)}n 的精确十进制形态），禁止用 number 承载`,
            path,
        );
    }
    return value;
}

/** 把宿主值编码为协议值；越界整数 `number` 与非有限浮点抛 `UnsafeNumberError`。 */
export function encodeValue(value: unknown, path = '$'): TaggedValue {
    if (value === null) {
        return null;
    }
    if (typeof value === 'boolean' || typeof value === 'string') {
        return value;
    }
    if (typeof value === 'number') {
        return encodeNumber(value, path);
    }
    if (typeof value === 'bigint') {
        return { $bigint: value.toString() };
    }
    if (value === undefined) {
        return { $undefined: true };
    }
    if (Array.isArray(value)) {
        return value.map((item, index) => encodeValue(item, `${path}[${index}]`));
    }
    if (typeof value === 'object') {
        const proto = Object.getPrototypeOf(value);
        if (proto !== Object.prototype && proto !== null) {
            throw new UnsafeNumberError(`${path}: 只允许 plain object 进入判题协议，收到 ${proto?.constructor?.name ?? 'unknown'}`, path);
        }
        const out: Record<string, TaggedValue> = {};
        for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
            out[key] = encodeValue(item, `${path}.${key}`);
        }
        return out;
    }
    throw new UnsafeNumberError(`${path}: 不支持协议编码的值类型 ${typeof value}`, path);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 把协议值解码回宿主值；tag 结构非法时抛 `ProtocolDecodeError`。 */
export function decodeValue(tagged: TaggedValue, path = '$'): unknown {
    if (tagged === null || typeof tagged === 'boolean' || typeof tagged === 'number' || typeof tagged === 'string') {
        return tagged;
    }
    if (Array.isArray(tagged)) {
        return tagged.map((item, index) => decodeValue(item, `${path}[${index}]`));
    }
    if (isPlainObject(tagged)) {
        const keys = Object.keys(tagged);
        if (keys.length === 1 && keys[0] === '$bigint') {
            const text = (tagged as { $bigint: unknown }).$bigint;
            if (typeof text !== 'string' || !/^-?\d+$/.test(text)) {
                throw new ProtocolDecodeError(`${path}: $bigint tag 需要十进制整数字符串，收到 ${JSON.stringify(text)}`);
            }
            return BigInt(text);
        }
        if (keys.length === 1 && keys[0] === '$undefined') {
            return undefined;
        }
        if (keys.some((key) => key.startsWith('$'))) {
            throw new ProtocolDecodeError(`${path}: 未知协议 tag 键 ${keys.find((key) => key.startsWith('$'))}`);
        }
        const out: Record<string, unknown> = {};
        for (const [key, item] of Object.entries(tagged)) {
            out[key] = decodeValue(item, `${path}.${key}`);
        }
        return out;
    }
    throw new ProtocolDecodeError(`${path}: 无法解码的协议值`);
}

// ── 消息形态 ──────────────────────────────────────────────────────────────

/** 单条用例的入参（`args` 已完成整数键规整，值均为协议编码）。 */
export type RunCase = {
    index: number;
    args: Record<string, TaggedValue>;
};

/** 失败用例的宿主侧观测：真实阶段与可确认的 guest trap 身份（验收观察门）。 */
export type CaseFailureObservation = {
    /** 异常归回的观测阶段。 */
    phase?: ObservationPhase;
    /** 仅明确 guest trap 才填写；宿主侧异常不得伪造。 */
    guestTrap?: { kind: string; reason: string };
};

/** judge → solver 子进程。`lane` 仅 managed 子进程使用（jvm/clr 分发）。 */
export type JudgeMessage =
    | { type: 'load'; invoke: string; solution?: string; artifactDir?: string; lane?: 'jvm' | 'clr' }
    | { type: 'run'; warmup: number; iterations: number; cases: RunCase[] }
    | { type: 'bye' };

export type CaseOutcome =
    | { index: number; ok: true; value: TaggedValue }
    | ({ index: number; ok: false; error: string } & CaseFailureObservation);

/** solver → judge 子进程回包。 */
export type SolverMessage =
    | { type: 'ready'; returnsAbi?: unknown }
    | { type: 'done'; results: CaseOutcome[]; samples: number[]; collectMs: number }
    | { type: 'error'; stage: 'load' | 'run'; message: string };

/** 把消息写成一行 NDJSON（消息内只含协议安全值）。 */
export function encodeLine(message: JudgeMessage | SolverMessage): string {
    return `${JSON.stringify(message)}\n`;
}

/** 解析一行 NDJSON 为消息；坏行抛 `ProtocolDecodeError`。 */
export function decodeLine(line: string): JudgeMessage | SolverMessage {
    let parsed: unknown;
    try {
        parsed = JSON.parse(line);
    } catch (err) {
        throw new ProtocolDecodeError(`协议行不是合法 JSON: ${String(err)}`);
    }
    if (!isPlainObject(parsed) || typeof parsed.type !== 'string') {
        throw new ProtocolDecodeError('协议行缺少 type 字段');
    }
    return parsed as JudgeMessage | SolverMessage;
}

/** 按行累积的 NDJSON 拆包器：喂入 chunk，吐出完整行。 */
export function createLineAssembler(onLine: (line: string) => void): (chunk: string) => void {
    let pending = '';
    return (chunk: string) => {
        pending += chunk;
        let cursor = pending.indexOf('\n');
        while (cursor >= 0) {
            const line = pending.slice(0, cursor).replace(/\r$/, '');
            pending = pending.slice(cursor + 1);
            if (line.trim().length > 0) {
                onLine(line);
            }
            cursor = pending.indexOf('\n');
        }
    };
}

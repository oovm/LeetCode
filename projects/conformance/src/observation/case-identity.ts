/**
 * 逐例身份与内容摘要（验收观察门）。
 *
 * 每条判题结果携带稳定 case identity 与内容摘要：隔离项绑定摘要后，
 * 坐标对应的语料内容一旦变化，摘要即不匹配，禁止继续静默隔离。
 * 摘要对 canonical JSON（键排序、递归稳定）取 sha256，与键序无关。
 */
import { createHash } from 'node:crypto';

function canonicalValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(canonicalValue);
    }
    if (typeof value === 'bigint') {
        return { $bigint: value.toString() };
    }
    if (value === undefined) {
        return { $undefined: true };
    }
    if (typeof value === 'object' && value !== null) {
        const record = value as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const key of Object.keys(record).sort()) {
            out[key] = canonicalValue(record[key]);
        }
        return out;
    }
    if (typeof value === 'number' && !Number.isFinite(value)) {
        return { $nonFinite: String(value) };
    }
    return value;
}

/** 稳定序列化：键按字典序递归排序，同一内容任何键序得到同一文本。 */
export function canonicalJson(value: unknown): string {
    return JSON.stringify(canonicalValue(value));
}

/** 内容的 sha256 摘要（十六进制小写）。 */
export function digestOf(value: unknown): string {
    return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

/** 场景用例的稳定身份：`<sceneId>::<export>`。 */
export function sceneCaseId(sceneId: string, exportName: string): string {
    return `${sceneId}::${exportName}`;
}

/** 场景用例内容摘要：绑定 `export`/`expected`/`note` 全量内容。 */
export function sceneCaseDigest(testCase: { export: string; expected: unknown; note?: unknown }): string {
    return digestOf({ export: testCase.export, expected: testCase.expected, note: testCase.note ?? null });
}

/** 判题用例的稳定身份：`<slug>::tests[<index>]`。 */
export function solverCaseId(slug: string, index: number): string {
    return `${slug}::tests[${index}]`;
}

/** 判题用例内容摘要：绑定 metadata 用例的 `args` 与 `expected` 原文。 */
export function solverCaseDigest(args: unknown, expected: unknown): string {
    return digestOf({ args, expected });
}

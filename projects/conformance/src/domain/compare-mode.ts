import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { integerResultText, isUnsafeIntegerLiteralString } from './integer-literal.ts';
import { CONFORMANCE_ROOT } from './paths.ts';

/**
 * 用例结果比较模式。`strict` 为 JSON 精确相等（整数按精确十进制文本），其余模式只放宽
 * 题面明确允许自由的维度，不改变值语义。
 */
export type CompareMode =
    | 'strict'
    | 'unordered-1d'
    | 'unordered-2d'
    | 'outer-only'
    | 'nested-1d'
    | 'validator-required';

const ALLOWED_MODES = new Set<string>([
    'strict',
    'unordered-1d',
    'unordered-2d',
    'outer-only',
    'nested-1d',
    'validator-required',
]);

type CompareModeEntry = { mode: CompareMode; evidence: string };
type CompareModeRegistry = {
    schemaVersion: number;
    note?: string;
    modes: Record<string, CompareModeEntry>;
};

const REGISTRY_PATH = join(CONFORMANCE_ROOT, 'coverage', 'compare-modes.json');
let cachedRegistry: CompareModeRegistry | null = null;

function registry(): CompareModeRegistry {
    if (cachedRegistry === null) {
        const parsed = JSON.parse(readFileSync(REGISTRY_PATH, 'utf8')) as CompareModeRegistry;
        for (const [id, entry] of Object.entries(parsed.modes)) {
            if (!ALLOWED_MODES.has(entry.mode)) {
                throw new Error(`${REGISTRY_PATH} / ${id}: 未知比较模式 ${String(entry.mode)}`);
            }
        }
        cachedRegistry = parsed;
    }
    return cachedRegistry;
}

/** 题目的比较模式；未登记时按 `strict`（JSON 精确相等）处理。 */
export function compareModeFor(problemId: string): CompareMode {
    return registry().modes[problemId]?.mode ?? 'strict';
}

/** 覆盖清单强制入口：必须显式登记比较模式，未登记抛出结构化错误。 */
export function requireCompareMode(problemId: string): CompareMode {
    const entry = registry().modes[problemId];
    if (!entry) {
        throw new Error(`未登记比较模式（coverage/compare-modes.json）：${problemId}`);
    }
    return entry.mode;
}

/**
 * 元素规范化键：整数（数值 / bigint / 超安全整数字符串）统一为精确十进制文本，
 * 字符串保持原样，数组递归但保持元素顺序。
 */
export function canonicalKey(value: unknown): string {
    if (typeof value === 'bigint') {
        return `i:${value.toString()}`;
    }
    if (typeof value === 'number') {
        return Number.isInteger(value) ? `i:${value.toString()}` : `n:${String(value)}`;
    }
    if (isUnsafeIntegerLiteralString(value)) {
        return `i:${integerResultText(value)}`;
    }
    if (value === null) {
        return 'null';
    }
    if (value === undefined) {
        return 'undefined';
    }
    if (Array.isArray(value)) {
        return `a:[${value.map(canonicalKey).join(',')}]`;
    }
    if (typeof value === 'string') {
        return `s:${JSON.stringify(value)}`;
    }
    if (typeof value === 'boolean') {
        return `b:${value ? '1' : '0'}`;
    }
    if (typeof value === 'object') {
        return `o:${JSON.stringify(value)}`;
    }
    return `${typeof value}:${String(value)}`;
}

function sortedKeys(items: readonly unknown[]): string[] {
    return items.map(canonicalKey).sort();
}

/**
 * 按模式生成可比较的规范形态。非数组值统一退化为单值键，因此模式对配电型用例
 * 不会引入额外语义。
 */
export function canonicalForm(value: unknown, mode: CompareMode): string {
    if (mode === 'strict') {
        throw new Error('strict 模式不使用规范化形态，请用 JSON 精确比较');
    }
    if (mode === 'validator-required') {
        throw new Error('该题允许多个合法答案，需要题面语义校验，禁止用规范化比较');
    }
    if (!Array.isArray(value)) {
        return `scalar:${canonicalKey(value)}`;
    }
    if (mode === 'unordered-1d') {
        return `a1:[${sortedKeys(value).join('|')}]`;
    }
    if (mode === 'unordered-2d') {
        const rows = value.map((row) =>
            Array.isArray(row) ? `row:[${sortedKeys(row).join('|')}]` : `scalar:${canonicalKey(row)}`,
        );
        return `a2:[${rows.sort().join('|')}]`;
    }
    if (mode === 'outer-only') {
        return `a1:[${value.map(canonicalKey).sort().join('|')}]`;
    }
    if (mode === 'nested-1d') {
        const rows = value.map((row) =>
            Array.isArray(row) ? `row:[${sortedKeys(row).join('|')}]` : `scalar:${canonicalKey(row)}`,
        );
        return `a1p:[${rows.join('|')}]`;
    }
    throw new Error(`未知比较模式 ${String(mode)}`);
}

/** 按模式比较实际值与期望值。`strict` 保持既有 JSON 精确相等语义。 */
export function resultsMatch(actual: unknown, expected: unknown, mode: CompareMode): boolean {
    if (mode === 'strict') {
        try {
            return JSON.stringify(actual) === JSON.stringify(expected);
        } catch {
            return false;
        }
    }
    return canonicalForm(actual, mode) === canonicalForm(expected, mode);
}

/** 安全序列化（含 bigint），用于失败信息，不让比较本身因 `bigint` 抛错。 */
export function formatValue(value: unknown): string {
    try {
        return JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? `${item.toString()}n` : item)) ?? String(value);
    } catch {
        return String(value);
    }
}

/** 多合法解题目的结构化拒绝原因。 */
export function validatorRequiredMessage(problemId: string): string {
    const entry = registry().modes[problemId];
    return `多解题 ${problemId} 需要题面语义校验，禁止 JSON/规范化比较（${entry?.evidence ?? '未登记证据'}）`;
}

/** 执行期入口：多合法解题目直接拒绝，不静默退回严格比较。 */
export function compareModeForExecution(problemId: string): CompareMode {
    const mode = compareModeFor(problemId);
    if (mode === 'validator-required') {
        throw new Error(validatorRequiredMessage(problemId));
    }
    return mode;
}

/**
 * 题面约束前置校验：判题前先确认 `cases 用例[].args` 满足题目声明的输入域。
 *
 * 判题绿只证明「与 expected 一致」；如果 args 本身违反题面约束，三通道一致也没有意义
 * （R34 的两道语料缺陷就是这样漏过去的）。本表按题登记约束，清单内每题都必须登记，
 * 未登记视为缺失并让覆盖测试失败。
 */

type Args = Record<string, unknown>;

export type ArgsConstraint = (args: Args) => string | null;

const isInt = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value);
const inRange = (value: unknown, min: number, max: number): boolean => isInt(value) && value >= min && value <= max;

function ints(value: unknown, path: string, min: number, max: number): string | null {
    if (!Array.isArray(value)) {
        return `${path} 不是数组`;
    }
    for (let index = 0; index < value.length; index += 1) {
        if (!inRange(value[index], min, max)) {
            return `${path}[${index}]=${String(value[index])} 越界，要求 ${min}..${max}`;
        }
    }
    return null;
}

function len(value: unknown, path: string, min: number, max: number): string | null {
    if (!Array.isArray(value)) {
        return `${path} 不是数组`;
    }
    if (value.length < min || value.length > max) {
        return `${path}.length=${value.length} 越界，要求 ${min}..${max}`;
    }
    return null;
}

function matrix(
    value: unknown,
    path: string,
    rowMin: number,
    rowMax: number,
    colMin: number,
    colMax: number,
    valueMin: number,
    valueMax: number,
    square: boolean,
): string | null {
    if (!Array.isArray(value)) {
        return `${path} 不是矩阵`;
    }
    if (value.length < rowMin || value.length > rowMax) {
        return `${path}.length=${value.length} 越界，要求 ${rowMin}..${rowMax}`;
    }
    for (let row = 0; row < value.length; row += 1) {
        const rowValue = value[row];
        if (!Array.isArray(rowValue)) {
            return `${path}[${row}] 不是数组`;
        }
        if (rowValue.length < colMin || rowValue.length > colMax) {
            return `${path}[${row}].length=${rowValue.length} 越界，要求 ${colMin}..${colMax}`;
        }
        if (square && rowValue.length !== value.length) {
            return `${path}[${row}].length=${rowValue.length} 与行数 ${value.length} 不一致`;
        }
        const issue = ints(rowValue, `${path}[${row}]`, valueMin, valueMax);
        if (issue) {
            return issue;
        }
    }
    return null;
}

function firstIssue(...issues: Array<string | null>): string | null {
    for (const issue of issues) {
        if (issue) {
            return issue;
        }
    }
    return null;
}

const CHECKS: ReadonlyMap<string, ArgsConstraint> = new Map<string, ArgsConstraint>([
    [
        'toeplitz-matrix',
        (args) =>
            firstIssue(
                matrix(args.matrix, 'args.matrix', 1, 20, 1, 20, 0, 99, false),
                (() => {
                    const rows = args.matrix as unknown[][];
                    const n = rows[0]?.length;
                    return rows.some((row) => row.length !== n) ? 'args.matrix 各行长度不一致' : null;
                })(),
            ),
    ],
    [
        'lucky-numbers-in-a-matrix',
        (args) => {
            const issue = matrix(args.matrix, 'args.matrix', 1, 50, 1, 50, 1, 100000, false);
            if (issue) {
                return issue;
            }
            const flat = (args.matrix as number[][]).flat();
            return new Set(flat).size === flat.length ? null : 'args.matrix 元素不唯一';
        },
    ],
    [
        'check-if-every-row-and-column-contains-all-numbers',
        (args) => {
            const rows = args.matrix as unknown[][];
            const n = Array.isArray(rows) ? rows.length : 0;
            return firstIssue(
                matrix(args.matrix, 'args.matrix', 1, 100, 1, 100, 1, Math.max(n, 1), true),
            );
        },
    ],
    [
        'determine-whether-matrix-can-be-obtained-by-rotation',
        (args) =>
            firstIssue(
                matrix(args.mat, 'args.mat', 1, 10, 1, 10, 0, 1, true),
                matrix(args.target, 'args.target', 1, 10, 1, 10, 0, 1, true),
                Array.isArray(args.mat) && Array.isArray(args.target) && args.mat.length === args.target.length
                    ? null
                    : 'args.mat 与 args.target 行数不一致',
            ),
    ],
    [
        'check-if-matrix-is-x-matrix',
        (args) => matrix(args.grid, 'args.grid', 3, 100, 3, 100, 0, 100000, true),
    ],
    [
        'matrix-similarity-after-cyclic-shifts',
        (args) =>
            firstIssue(
                matrix(args.mat, 'args.mat', 1, 25, 1, 25, 1, 25, false),
                inRange(args.k, 1, 50) ? null : `args.k=${String(args.k)} 越界，要求 1..50`,
            ),
    ],
    ['largest-unique-number', (args) => firstIssue(len(args.nums, 'args.nums', 1, 2000), ints(args.nums, 'args.nums', 0, 1000))],
    [
        'divide-array-into-equal-pairs',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 2, 1000),
                Array.isArray(args.nums) && args.nums.length % 2 === 0 ? null : 'args.nums.length 必须为偶数',
                ints(args.nums, 'args.nums', 1, 500),
            ),
    ],
    [
        'number-of-beautiful-pairs',
        (args) => {
            const issue = firstIssue(len(args.nums, 'args.nums', 2, 100), ints(args.nums, 'args.nums', 1, 9999));
            if (issue) {
                return issue;
            }
            const bad = (args.nums as number[]).findIndex((value) => value % 10 === 0);
            return bad >= 0 ? `args.nums[${bad}]=${(args.nums as number[])[bad]} 必须是 10 的倍数以外` : null;
        },
    ],
    [
        'count-pairs-that-form-a-complete-day-i',
        (args) => firstIssue(len(args.hours, 'args.hours', 1, 100), ints(args.hours, 'args.hours', 1, 1000000000)),
    ],
    [
        'find-the-xor-of-numbers-which-appear-twice',
        (args) => {
            const issue = firstIssue(len(args.nums, 'args.nums', 1, 50), ints(args.nums, 'args.nums', 1, 50));
            if (issue) {
                return issue;
            }
            const counts = new Map<number, number>();
            for (const value of args.nums as number[]) {
                counts.set(value, (counts.get(value) ?? 0) + 1);
            }
            for (const [value, count] of counts) {
                if (count > 2) {
                    return `args.nums 中 ${value} 出现 ${count} 次，题面要求至多两次`;
                }
            }
            return null;
        },
    ],
    [
        'two-out-of-three',
        (args) =>
            firstIssue(
                len(args.nums1, 'args.nums1', 1, 100),
                len(args.nums2, 'args.nums2', 1, 100),
                len(args.nums3, 'args.nums3', 1, 100),
                ints(args.nums1, 'args.nums1', 1, 100),
                ints(args.nums2, 'args.nums2', 1, 100),
                ints(args.nums3, 'args.nums3', 1, 100),
            ),
    ],
    [
        'longest-strictly-increasing-or-strictly-decreasing-subarray',
        (args) => firstIssue(len(args.nums, 'args.nums', 1, 50), ints(args.nums, 'args.nums', 1, 50)),
    ],
    [
        'longest-even-odd-subarray-with-threshold',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 1, 100),
                ints(args.nums, 'args.nums', 1, 100),
                inRange(args.threshold, 1, 100) ? null : `args.threshold=${String(args.threshold)} 越界，要求 1..100`,
            ),
    ],
    [
        'shortest-subarray-with-or-at-least-k-i',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 1, 50),
                ints(args.nums, 'args.nums', 0, 50),
                inRange(args.k, 0, 63) ? null : `args.k=${String(args.k)} 越界，要求 0..63`,
            ),
    ],
    [
        'find-subarrays-with-equal-sum',
        (args) => firstIssue(len(args.nums, 'args.nums', 2, 1000), ints(args.nums, 'args.nums', -1000000000, 1000000000)),
    ],
    [
        'count-partitions-with-even-sum-difference',
        (args) => firstIssue(len(args.nums, 'args.nums', 2, 100), ints(args.nums, 'args.nums', 1, 100)),
    ],
    [
        'minimum-difference-between-highest-and-lowest-of-k-scores',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 1, 1000),
                ints(args.nums, 'args.nums', 0, 100000),
                Array.isArray(args.nums) && inRange(args.k, 1, args.nums.length)
                    ? null
                    : `args.k=${String(args.k)} 越界，要求 1..nums.length`,
            ),
    ],
    [
        'longest-subsequence-with-limited-sum',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 1, 1000),
                len(args.queries, 'args.queries', 1, 1000),
                ints(args.nums, 'args.nums', 1, 1000000),
                ints(args.queries, 'args.queries', 1, 1000000),
            ),
    ],
    [
        'kth-missing-positive-number',
        (args) => {
            const issue = firstIssue(
                len(args.arr, 'args.arr', 1, 1000),
                ints(args.arr, 'args.arr', 1, 1000),
                inRange(args.k, 1, 1000) ? null : `args.k=${String(args.k)} 越界，要求 1..1000`,
            );
            if (issue) {
                return issue;
            }
            for (let index = 1; index < (args.arr as number[]).length; index += 1) {
                if ((args.arr as number[])[index - 1] >= (args.arr as number[])[index]) {
                    return `args.arr[${index - 1}] 与 args.arr[${index}] 不是严格递增`;
                }
            }
            return null;
        },
    ],
    [
        'maximum-product-difference-between-two-pairs',
        (args) => firstIssue(len(args.nums, 'args.nums', 4, 10000), ints(args.nums, 'args.nums', 1, 10000)),
    ],
    [
        'determine-the-winner-of-a-bowling-game',
        (args) =>
            firstIssue(
                len(args.player1, 'args.player1', 1, 1000),
                len(args.player2, 'args.player2', 1, 1000),
                Array.isArray(args.player1) && Array.isArray(args.player2) && args.player1.length === args.player2.length
                    ? null
                    : 'args.player1 与 args.player2 长度不一致',
                ints(args.player1, 'args.player1', 0, 10),
                ints(args.player2, 'args.player2', 0, 10),
            ),
    ],
    [
        'min-max-game',
        (args) => {
            const issue = firstIssue(len(args.nums, 'args.nums', 1, 1024), ints(args.nums, 'args.nums', 1, 1000000000));
            if (issue) {
                return issue;
            }
            const length = (args.nums as number[]).length;
            return (length & (length - 1)) === 0 ? null : `args.nums.length=${length} 不是 2 的幂`;
        },
    ],
    [
        'minimum-total-operations',
        (args) => firstIssue(len(args.nums, 'args.nums', 1, 100000), ints(args.nums, 'args.nums', -1000000000, 1000000000)),
    ],
    [
        'minimum-operations-to-make-array-values-equal-to-k',
        (args) =>
            firstIssue(
                len(args.nums, 'args.nums', 1, 100),
                ints(args.nums, 'args.nums', 1, 100),
                inRange(args.k, 1, 100) ? null : `args.k=${String(args.k)} 越界，要求 1..100`,
            ),
    ],
    [
        'minimum-number-of-operations-to-make-elements-in-array-distinct',
        (args) => firstIssue(len(args.nums, 'args.nums', 1, 100), ints(args.nums, 'args.nums', 1, 100)),
    ],
]);

/** 取某题登记的题面约束；未登记直接抛出，避免新题绕过前置校验。 */
export function requireArgsConstraint(problemId: string): ArgsConstraint {
    const check = CHECKS.get(problemId);
    if (!check) {
        throw new Error(`${problemId}: 未登记题面约束（args-constraints.ts）`);
    }
    return check;
}

/** 返回 `null` 表示通过，否则返回首个违反题面约束的坐标与原因。 */
export function validateTestArgs(check: ArgsConstraint, args: Args): string | null {
    return check(args);
}

/**
 * 题面语义校验器（`validator-required` 比较模式的唯一实现点）。
 *
 * 判据：不放宽比较，只看答案是否满足题面约束。校验器统一忽略 `expected` 的“某个具体答案”，
 * 只把它当普通入参保留在签名里；判定依赖 `actual` 与 `args`。
 * Python lane 的同名实现见 `scripts/semantic_validators.py`，两边必须保持一致。
 */
export type SemanticValidator = (actual: unknown, expected: unknown, args: Record<string, unknown>) => string | null;

function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === 'bigint') {
        const asNumber = Number(value);
        return Number.isSafeInteger(asNumber) ? asNumber : null;
    }
    if (typeof value === 'string' && /^-?\d+$/.test(value)) {
        const asNumber = Number(value);
        return Number.isSafeInteger(asNumber) ? asNumber : null;
    }
    return null;
}

function intArray(value: unknown): number[] | null {
    if (!Array.isArray(value)) {
        return null;
    }
    const out: number[] = [];
    for (const item of value) {
        const parsed = toNumber(item);
        if (parsed === null) {
            return null;
        }
        out.push(parsed);
    }
    return out;
}

function intMatrix(value: unknown): number[][] | null {
    if (!Array.isArray(value)) {
        return null;
    }
    const out: number[][] = [];
    for (const row of value) {
        const parsed = intArray(row);
        if (parsed === null) {
            return null;
        }
        out.push(parsed);
    }
    return out;
}

function stableValue(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map(stableValue).join(',')}]`;
    }
    if (value !== null && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        return `{${Object.keys(record)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${stableValue(record[key])}`)
            .join(',')}}`;
    }
    return JSON.stringify(value);
}

function sameMultiset(left: unknown[], right: unknown[]): boolean {
    if (left.length !== right.length) {
        return false;
    }
    const sortedLeft = left.map(stableValue).sort();
    const sortedRight = right.map(stableValue).sort();
    return sortedLeft.every((item, index) => item === sortedRight[index]);
}

function argInts(args: Record<string, unknown>, key: string): number[] | null {
    return intArray(args[key]);
}

const validateAdvantageShuffle: SemanticValidator = (actual, _expected, args) => {
    const nums1 = argInts(args, 'nums1');
    const nums2 = argInts(args, 'nums2');
    const shuffles = intArray(actual);
    if (!nums1 || !nums2 || !shuffles) {
        return '答案或入参不是整数数组';
    }
    if (!sameMultiset(nums2, shuffles)) {
        return '答案不是 nums2 的排列';
    }
    const sorted1 = nums1.slice().sort((a, b) => a - b);
    const sorted2 = nums2.slice().sort((a, b) => a - b);
    let right = 0;
    let maxWins = 0;
    for (const value of sorted1) {
        if (right < sorted2.length && value > sorted2[right]) {
            maxWins += 1;
            right += 1;
        }
    }
    let wins = 0;
    for (let index = 0; index < nums1.length; index += 1) {
        if (nums1[index] > shuffles[index]) {
            wins += 1;
        }
    }
    if (wins !== maxWins) {
        return `优势数 ${wins}，题面上限 ${maxWins}`;
    }
    return null;
};

const validateCourseScheduleTwo: SemanticValidator = (actual, _expected, args) => {
    const numCourses = toNumber(args.numCourses);
    const prerequisites = intMatrix(args.prerequisites);
    const order = intArray(actual);
    if (numCourses === null || !prerequisites || !order) {
        return '答案或入参形态不合法';
    }
    const edges: Array<[number, number]> = [];
    const adjacency: number[][] = Array.from({ length: numCourses }, () => []);
    const indegree = new Array<number>(numCourses).fill(0);
    for (const pair of prerequisites) {
        if (pair.length !== 2) {
            return 'prerequisites 单元不是二元组';
        }
        const [course, prerequisite] = pair;
        if (course < 0 || course >= numCourses || prerequisite < 0 || prerequisite >= numCourses) {
            return 'prerequisites 越界';
        }
        edges.push([prerequisite, course]);
        adjacency[prerequisite].push(course);
        indegree[course] += 1;
    }
    let acyclic = true;
    const queue: number[] = [];
    for (let node = 0; node < numCourses; node += 1) {
        if (indegree[node] === 0) {
            queue.push(node);
        }
    }
    let visited = 0;
    const degrees = indegree.slice();
    for (let head = 0; head < queue.length; head += 1) {
        const node = queue[head];
        visited += 1;
        for (const next of adjacency[node]) {
            degrees[next] -= 1;
            if (degrees[next] === 0) {
                queue.push(next);
            }
        }
    }
    if (visited !== numCourses) {
        acyclic = false;
    }
    if (!acyclic) {
        return order.length === 0 ? null : '课程图有环，题面要求返回空数组';
    }
    if (order.length !== numCourses) {
        return `拓扑序长度 ${order.length}，题面要求 ${numCourses}`;
    }
    const seen = new Set<number>();
    for (const course of order) {
        if (course < 0 || course >= numCourses || seen.has(course)) {
            return '拓扑序存在重复或越界课程';
        }
        seen.add(course);
    }
    const positions = new Map<number, number>();
    order.forEach((course, index) => positions.set(course, index));
    for (const [before, after] of edges) {
        if (positions.get(before)! > positions.get(after)!) {
            return `先修关系不满足：${before} 应在 ${after} 之前`;
        }
    }
    return null;
};

const validateDiStringMatch: SemanticValidator = (actual, _expected, args) => {
    const pattern = args.s;
    const values = intArray(actual);
    if (typeof pattern !== 'string' || !values) {
        return '答案或入参形态不合法';
    }
    const size = pattern.length + 1;
    if (values.length !== size) {
        return `答案长度 ${values.length}，题面要求 ${size}`;
    }
    const seen = new Set<number>();
    for (const value of values) {
        if (value < 0 || value >= size || seen.has(value)) {
            return '答案不是 0..n 的排列';
        }
        seen.add(value);
    }
    for (let index = 0; index < pattern.length; index += 1) {
        const expectedRelation = pattern[index] === 'I' ? values[index] < values[index + 1] : values[index] > values[index + 1];
        if (!expectedRelation) {
            return `第 ${index} 位不满足 ${pattern[index]}`;
        }
    }
    return null;
};

const validateErectTheFence: SemanticValidator = (actual, _expected, args) => {
    const trees = intMatrix(args.trees);
    const fence = intMatrix(actual);
    if (!trees || !fence) {
        return '答案或入参形态不合法';
    }
    const uniqueTrees = [...new Set(trees.map((point) => point.join(',')))].map((key) => key.split(',').map(Number));
    const cross = (origin: number[], a: number[], b: number[]): number =>
        (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0]);
    const sorted = uniqueTrees.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    // 题面要求返回围栏上的点；共线且落在边上的树也算围栏点，
    // 因此边界集合 = 严格凸包顶点 + 凸包边上的点。
    if (sorted.length <= 2) {
        const boundarySet = new Set(sorted.map((point) => point.join(',')));
        for (const point of fence) {
            if (!boundarySet.has(point.join(','))) {
                return '围栏端点不完整';
            }
        }
        for (const key of boundarySet) {
            if (!fence.some((point) => point.join(',') === key)) {
                return '围栏端点不完整';
            }
        }
        return null;
    }
    const lower: number[][] = [];
    for (const point of sorted) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
            lower.pop();
        }
        lower.push(point);
    }
    const upper: number[][] = [];
    for (let index = sorted.length - 1; index >= 0; index -= 1) {
        const point = sorted[index];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
            upper.pop();
        }
        upper.push(point);
    }
    const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
    const hullEdges: Array<[number[], number[]]> = [];
    for (let index = 0; index < hull.length; index += 1) {
        hullEdges.push([hull[index], hull[(index + 1) % hull.length]]);
    }
    const onEdge = (point: number[], start: number[], end: number[]): boolean => {
        if (cross(start, end, point) !== 0) {
            return false;
        }
        return (
            Math.min(start[0], end[0]) <= point[0] &&
            point[0] <= Math.max(start[0], end[0]) &&
            Math.min(start[1], end[1]) <= point[1] &&
            point[1] <= Math.max(start[1], end[1])
        );
    };
    const expectedBoundary = new Set<string>(hull.map((point) => point.join(',')));
    for (const point of sorted) {
        if (hullEdges.some(([start, end]) => onEdge(point, start, end))) {
            expectedBoundary.add(point.join(','));
        }
    }
    const fenceSet = new Set(fence.map((point) => point.join(',')));
    const missing = [...expectedBoundary].filter((key) => !fenceSet.has(key));
    if (missing.length > 0) {
        return `缺少围栏点 ${missing.slice(0, 3).join(' ')}`;
    }
    for (const key of fenceSet) {
        if (!expectedBoundary.has(key)) {
            return `围栏包含非边界点 ${key}`;
        }
    }
    return null;
};

const validateFairCandySwap: SemanticValidator = (actual, _expected, args) => {
    const alice = argInts(args, 'aliceSizes');
    const bob = argInts(args, 'bobSizes');
    if (!alice || !bob) {
        return '入参形态不合法';
    }
    const sumAlice = alice.reduce((sum, value) => sum + value, 0);
    const sumBob = bob.reduce((sum, value) => sum + value, 0);
    // 交换 x（Alice 给 Bob）与 y（Bob 给 Alice）后等和 ⇔ 2*(x-y) = sumAlice - sumBob。
    const bobSet = new Set(bob);
    let exists = false;
    for (const take of alice) {
        const give = take - (sumAlice - sumBob) / 2;
        if (Number.isInteger(give) && bobSet.has(give)) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        // 题面保证有解；语料中的无解用例以 null 表示“返回任意值均不可满足”。
        return actual === null || (Array.isArray(actual) && actual.length === 0)
            ? null
            : '题面无合法交换，答案应为 null';
    }
    const swap = intArray(actual);
    if (!swap || swap.length !== 2) {
        return '答案或入参形态不合法';
    }
    const [take, give] = swap;
    if (!alice.includes(take) || !bobSet.has(give)) {
        return '交换值不属于对应数组';
    }
    if (sumAlice - take + give !== sumBob - give + take) {
        return '交换后两堆总和仍不相等';
    }
    return null;
};

function validateIndexValueDifference(actual: unknown, args: Record<string, unknown>): string | null {
    const nums = argInts(args, 'nums');
    const indexDifference = toNumber(args.indexDifference);
    const valueDifference = toNumber(args.valueDifference);
    const answer = intArray(actual);
    if (!nums || indexDifference === null || valueDifference === null || !answer) {
        return '答案或入参形态不合法';
    }
    if (answer.length !== 2) {
        return '答案不是二元组';
    }
    const [left, right] = answer;
    const noPair = left === -1 && right === -1;
    // 前缀 min/max 的「值与下标」能 O(n) 判定是否存在合法对；校验器与题解一样不假设答案非空。
    let minIndex = -1;
    let maxIndex = -1;
    let minValue = Infinity;
    let maxValue = -Infinity;
    let exists = false;
    for (let index = 0; index < nums.length; index += 1) {
        if (index - indexDifference >= 0) {
            const candidate = index - indexDifference;
            if (nums[candidate] < minValue) {
                minValue = nums[candidate];
                minIndex = candidate;
            }
            if (nums[candidate] > maxValue) {
                maxValue = nums[candidate];
                maxIndex = candidate;
            }
        }
        if (minIndex >= 0 && Math.abs(nums[index] - minValue) >= valueDifference) {
            exists = true;
        }
        if (maxIndex >= 0 && Math.abs(nums[index] - maxValue) >= valueDifference) {
            exists = true;
        }
    }
    if (!exists) {
        return noPair ? null : '题面无合法对，应返回 [-1,-1]';
    }
    if (noPair) {
        return '题面存在合法对，不能返回 [-1,-1]';
    }
    if (left < 0 || right < 0 || left >= nums.length || right >= nums.length) {
        return '答案下标越界';
    }
    if (Math.abs(left - right) < indexDifference) {
        return '下标差不足';
    }
    if (Math.abs(nums[left] - nums[right]) < valueDifference) {
        return '值差不足';
    }
    return null;
}

const validateFindMissingObservations: SemanticValidator = (actual, _expected, args) => {
    const rolls = argInts(args, 'rolls');
    const mean = toNumber(args.mean);
    const n = toNumber(args.n);
    if (!rolls || mean === null || n === null) {
        return '入参形态不合法';
    }
    const total = rolls.length + n;
    const missingSum = mean * total - rolls.reduce((sum, value) => sum + value, 0);
    // 每个缺失观测取 1..6，故 n <= missingSum <= 6*n；不满足即题面要求返回空数组。
    if (missingSum < n || missingSum > 6 * n) {
        return Array.isArray(actual) && actual.length === 0 ? null : '题面无可行缺失观测，应返回空数组';
    }
    const observations = intArray(actual);
    if (!observations) {
        return '答案不是整数数组';
    }
    if (observations.length !== n) {
        return `缺失观测长度 ${observations.length}，题面要求 ${n}`;
    }
    for (const value of observations) {
        if (value < 1 || value > 6) {
            return '缺失观测不在 1..6';
        }
    }
    const actualSum = rolls.reduce((sum, value) => sum + value, 0) + observations.reduce((sum, value) => sum + value, 0);
    if (actualSum !== mean * total) {
        return `总和 ${actualSum}，题面要求 ${mean * total}`;
    }
    return null;
};

const validateUniqueSumZero: SemanticValidator = (actual, _expected, args) => {
    const n = toNumber(args.n);
    const values = intArray(actual);
    if (n === null || !values) {
        return '答案或入参形态不合法';
    }
    if (values.length !== n) {
        return `长度 ${values.length}，题面要求 ${n}`;
    }
    if (new Set(values).size !== values.length) {
        return '答案存在重复整数';
    }
    if (values.reduce((sum, value) => sum + value, 0) !== 0) {
        return '答案总和不等于 0';
    }
    return null;
};

const validateUniqueBinaryString: SemanticValidator = (actual, _expected, args) => {
    const nums = args.nums;
    if (!Array.isArray(nums) || nums.some((item) => typeof item !== 'string')) {
        return '入参不是二进制字符串数组';
    }
    const size = nums.length;
    if (typeof actual !== 'string') {
        return '答案不是字符串';
    }
    if (actual.length !== size || !/^[01]+$/.test(actual)) {
        return `答案必须是长度 ${size} 的二进制串`;
    }
    if (nums.includes(actual)) {
        return '答案已出现在 nums 中';
    }
    return null;
};

const validateGrayCode: SemanticValidator = (actual, _expected, args) => {
    const n = toNumber(args.n);
    const values = intArray(actual);
    if (n === null || n < 0 || n > 20 || !values) {
        return '答案或入参形态不合法';
    }
    const size = 2 ** n;
    if (values.length !== size) {
        return `长度 ${values.length}，题面要求 ${size}`;
    }
    const seen = new Set<number>();
    for (const value of values) {
        if (value < 0 || value >= size || seen.has(value)) {
            return '答案不是 0..2^n-1 的排列';
        }
        seen.add(value);
    }
    if (values[0] !== 0) {
        return '首项必须是 0';
    }
    const popcount = (value: number): number => {
        let count = 0;
        for (let bits = value; bits > 0; bits >>= 1) {
            count += bits & 1;
        }
        return count;
    };
    for (let index = 0; index + 1 < values.length; index += 1) {
        if (popcount(values[index] ^ values[index + 1]) !== 1) {
            return `第 ${index} 与 ${index + 1} 项不是单 bit 变化`;
        }
    }
    return null;
};

const validateMatrixDistanceOrder: SemanticValidator = (actual, _expected, args) => {
    const rows = toNumber(args.rows);
    const cols = toNumber(args.cols);
    const rCenter = toNumber(args.rCenter);
    const cCenter = toNumber(args.cCenter);
    const cells = intMatrix(actual);
    if (rows === null || cols === null || rCenter === null || cCenter === null || !cells) {
        return '答案或入参形态不合法';
    }
    if (cells.length !== rows * cols) {
        return `格子数 ${cells.length}，题面要求 ${rows * cols}`;
    }
    const seen = new Set<string>();
    let previousDistance = -1;
    for (const cell of cells) {
        if (cell.length !== 2 || cell[0] < 0 || cell[0] >= rows || cell[1] < 0 || cell[1] >= cols) {
            return '答案包含越界格子';
        }
        const key = cell.join(',');
        if (seen.has(key)) {
            return '答案包含重复格子';
        }
        seen.add(key);
        const distance = Math.abs(cell[0] - rCenter) + Math.abs(cell[1] - cCenter);
        if (distance < previousDistance) {
            return '格子没有按曼哈顿距离非降序排列';
        }
        previousDistance = distance;
    }
    return null;
};

const validateRestoreTheArray: SemanticValidator = (actual, _expected, args) => {
    const pairs = intMatrix(args.adjacentPairs);
    const array = intArray(actual);
    if (!pairs || !array) {
        return '答案或入参形态不合法';
    }
    if (array.length !== pairs.length + 1) {
        return `答案长度 ${array.length}，题面要求 ${pairs.length + 1}`;
    }
    const expectedEdges = pairs.map((pair) => (pair[0] <= pair[1] ? `${pair[0]},${pair[1]}` : `${pair[1]},${pair[0]}`));
    const actualEdges: string[] = [];
    for (let index = 0; index + 1 < array.length; index += 1) {
        actualEdges.push(array[index] <= array[index + 1] ? `${array[index]},${array[index + 1]}` : `${array[index + 1]},${array[index]}`);
    }
    if (!sameMultiset(expectedEdges, actualEdges)) {
        return '答案的相邻对与输入不匹配';
    }
    return null;
};

const validateSmallestSufficientTeam: SemanticValidator = (actual, _expected, args) => {
    const skills = args.req_skills;
    const people = args.people;
    const team = intArray(actual);
    if (!Array.isArray(skills) || !Array.isArray(people) || !team) {
        return '答案或入参形态不合法';
    }
    const skillIndex = new Map<string, number>();
    for (const skill of skills) {
        if (typeof skill !== 'string') {
            return 'req_skills 不是字符串数组';
        }
        skillIndex.set(skill, skillIndex.size);
    }
    const masks: number[] = [];
    for (const person of people) {
        if (!Array.isArray(person)) {
            return 'people 单元不是技能数组';
        }
        let mask = 0;
        for (const skill of person) {
            const index = typeof skill === 'string' ? skillIndex.get(skill) : undefined;
            if (index === undefined) {
                return `people 包含未知技能 ${String(skill)}`;
            }
            mask |= 1 << index;
        }
        masks.push(mask);
    }
    const full = (1 << skills.length) - 1;
    const best = new Array<number>(full + 1).fill(Infinity);
    best[0] = 0;
    for (const mask of masks) {
        const next = best.slice();
        for (let covered = 0; covered <= full; covered += 1) {
            if (best[covered] === Infinity) {
                continue;
            }
            const merged = covered | mask;
            if (best[covered] + 1 < next[merged]) {
                next[merged] = best[covered] + 1;
            }
        }
        for (let covered = 0; covered <= full; covered += 1) {
            best[covered] = next[covered];
        }
    }
    if (best[full] === Infinity) {
        return '题面无可行团队';
    }
    const seen = new Set<number>();
    let covered = 0;
    for (const index of team) {
        if (index < 0 || index >= people.length || seen.has(index)) {
            return '团队下标越界或重复';
        }
        seen.add(index);
        covered |= masks[index];
    }
    if (covered !== full) {
        return '团队未覆盖全部技能';
    }
    if (team.length !== best[full]) {
        return `团队规模 ${team.length}，题面最小 ${best[full]}`;
    }
    return null;
};

const validateFrequencySort: SemanticValidator = (actual, _expected, args) => {
    const source = args.s;
    if (typeof source !== 'string' || typeof actual !== 'string') {
        return '答案或入参形态不合法';
    }
    if (!sameMultiset([...source], [...actual])) {
        return '答案不是原字符串的字符重排';
    }
    const counts = new Map<string, number>();
    for (const char of actual) {
        counts.set(char, (counts.get(char) ?? 0) + 1);
    }
    const runs: Array<{ char: string; count: number }> = [];
    for (const char of actual) {
        const last = runs[runs.length - 1];
        if (last && last.char === char) {
            last.count += 1;
        } else {
            runs.push({ char, count: 1 });
        }
    }
    if (runs.length !== counts.size) {
        return '同一字符被拆成多段';
    }
    for (const run of runs) {
        if (counts.get(run.char) !== run.count) {
            return '字符段长度与原串频次不一致';
        }
    }
    for (let index = 1; index < runs.length; index += 1) {
        if (runs[index - 1].count < runs[index].count) {
            return '字符频次没有按非升序排列';
        }
    }
    return null;
};

const validateParityPartition: SemanticValidator = (actual, _expected, args) => {
    const nums = argInts(args, 'nums');
    const values = intArray(actual);
    if (!nums || !values) {
        return '答案或入参形态不合法';
    }
    if (!sameMultiset(nums, values)) {
        return '答案不是原数组的排列';
    }
    let seenOdd = false;
    for (const value of values) {
        if (value % 2 !== 0) {
            seenOdd = true;
        } else if (seenOdd) {
            return '偶数出现在奇数之后';
        }
    }
    return null;
};

const validateParityAlternating: SemanticValidator = (actual, _expected, args) => {
    const nums = argInts(args, 'nums');
    const values = intArray(actual);
    if (!nums || !values) {
        return '答案或入参形态不合法';
    }
    if (!sameMultiset(nums, values)) {
        return '答案不是原数组的排列';
    }
    for (let index = 0; index < values.length; index += 1) {
        if (values[index] % 2 !== index % 2) {
            return `第 ${index} 位奇偶性与下标不一致`;
        }
    }
    return null;
};

const VALIDATORS: Record<string, SemanticValidator> = {
    'advantage-shuffle': validateAdvantageShuffle,
    'course-schedule-ii': validateCourseScheduleTwo,
    'di-string-match': validateDiStringMatch,
    'erect-the-fence': validateErectTheFence,
    'fair-candy-swap': validateFairCandySwap,
    'find-indices-with-index-and-value-difference-i': (actual, _expected, args) => validateIndexValueDifference(actual, args),
    'find-indices-with-index-and-value-difference-ii': (actual, _expected, args) => validateIndexValueDifference(actual, args),
    'find-missing-observations': validateFindMissingObservations,
    'find-n-unique-integers-sum-up-to-zero': validateUniqueSumZero,
    'find-unique-binary-string': validateUniqueBinaryString,
    'gray-code': validateGrayCode,
    'matrix-cells-in-distance-order': validateMatrixDistanceOrder,
    'restore-the-array-from-adjacent-pairs': validateRestoreTheArray,
    'smallest-sufficient-team': validateSmallestSufficientTeam,
    'sort-characters-by-frequency': validateFrequencySort,
    'sort-array-by-parity': validateParityPartition,
    'sort-array-by-parity-ii': validateParityAlternating,
};

export function hasSemanticValidator(problemId: string): boolean {
    return Object.prototype.hasOwnProperty.call(VALIDATORS, problemId);
}

export function validateSemantic(problemId: string, actual: unknown, expected: unknown, args: Record<string, unknown>): string | null {
    const validator = VALIDATORS[problemId];
    if (!validator) {
        return `题目 ${problemId} 没有语义校验器`;
    }
    return validator(actual, expected, args);
}

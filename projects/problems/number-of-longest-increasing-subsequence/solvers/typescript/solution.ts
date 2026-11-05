export class Solution {
    findNumberOfLIS(nums: number[]): number {
        const total = nums.length;
        if (total === 0) {
            return 0;
        }
        const distinct = [...new Set(nums)].sort((a, b) => a - b);
        const rank = new Map<number, number>();
        distinct.forEach((value, index) => rank.set(value, index + 1));
        const size = distinct.length;
        const lengths = new Array<number>(size + 1).fill(0);
        const counts = new Array<number>(size + 1).fill(0);
        let bestLength = 0;
        let bestCount = 0;
        for (const value of nums) {
            const position = rank.get(value)!;
            let queryLength = 0;
            let queryCount = 0;
            for (let at = position - 1; at > 0; at -= at & -at) {
                const length = lengths[at];
                const count = counts[at];
                if (length > queryLength) {
                    queryLength = length;
                    queryCount = count;
                } else if (length === queryLength) {
                    queryCount += count;
                }
            }
            const length = queryLength + 1;
            const count = queryCount === 0 ? 1 : queryCount;
            for (let at = position; at <= size; at += at & -at) {
                if (length > lengths[at]) {
                    lengths[at] = length;
                    counts[at] = count;
                } else if (length === lengths[at]) {
                    counts[at] += count;
                }
            }
            if (length > bestLength) {
                bestLength = length;
                bestCount = count;
            } else if (length === bestLength) {
                bestCount += count;
            }
        }
        return bestCount;
    }
}

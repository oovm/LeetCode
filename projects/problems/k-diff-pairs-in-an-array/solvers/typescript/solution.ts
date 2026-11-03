export class Solution {
    findPairs(nums: number[], k: number): number {
        const count = new Map<number, number>();
        for (const x of nums) count.set(x, (count.get(x) ?? 0) + 1);
        let result = 0;
        for (const [x, c] of count) {
            if (k === 0 ? c >= 2 : count.has(x + k)) result++;
        }
        return result;
    }
}

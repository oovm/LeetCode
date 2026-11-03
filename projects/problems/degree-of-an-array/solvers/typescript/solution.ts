export class Solution {
    findShortestSubArray(nums: number[]): number {
        const first = new Map<number, number>();
        const last = new Map<number, number>();
        const count = new Map<number, number>();
        let degree = 0;
        for (let i = 0; i < nums.length; i++) {
            const v = nums[i];
            if (!first.has(v)) first.set(v, i);
            last.set(v, i);
            const c = (count.get(v) ?? 0) + 1;
            count.set(v, c);
            degree = Math.max(degree, c);
        }
        let best = nums.length;
        for (const [v, c] of count) {
            if (c === degree) {
                best = Math.min(best, last.get(v)! - first.get(v)! + 1);
            }
        }
        return best;
    }
}

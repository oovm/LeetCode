export class Solution {
    largestInteger(nums: number[], k: number): number {
        const count = new Map<number, number>();
        for (let i = 0; i + k <= nums.length; i++) {
            for (const x of new Set(nums.slice(i, i + k))) {
                count.set(x, (count.get(x) ?? 0) + 1);
            }
        }
        let best = -1;
        for (const [x, c] of count) {
            if (c === 1) best = Math.max(best, x);
        }
        return best;
    }
}

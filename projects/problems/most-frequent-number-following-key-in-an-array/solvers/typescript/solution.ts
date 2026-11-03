export class Solution {
    mostFrequent(nums: number[], key: number): number {
        const count = new Map<number, number>();
        for (let i = 0; i + 1 < nums.length; i++) {
            if (nums[i] === key) {
                const next = nums[i + 1];
                count.set(next, (count.get(next) ?? 0) + 1);
            }
        }
        let best = 0;
        let bestCount = 0;
        for (const [v, c] of count) {
            if (c > bestCount) {
                bestCount = c;
                best = v;
            }
        }
        return best;
    }
}

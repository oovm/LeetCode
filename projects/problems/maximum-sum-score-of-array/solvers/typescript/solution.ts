export class Solution {
    maximumSumScore(nums: number[]): number {
        const total = nums.reduce((sum, v) => sum + v, 0);
        let left = 0;
        let right = total;
        let best = -Infinity;
        for (const v of nums) {
            left += v;
            best = Math.max(best, left, right);
            right -= v;
        }
        return best;
    }
}

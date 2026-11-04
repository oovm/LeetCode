export class Solution {
    maxSubarraySumCircular(nums: number[]): number {
        let total = 0;
        let maxEnding = 0;
        let minEnding = 0;
        let best = nums[0];
        let worst = nums[0];
        for (const value of nums) {
            total += value;
            maxEnding = Math.max(maxEnding + value, value);
            best = Math.max(best, maxEnding);
            minEnding = Math.min(minEnding + value, value);
            worst = Math.min(worst, minEnding);
        }
        if (best < 0) return best;
        return Math.max(best, total - worst);
    }
}

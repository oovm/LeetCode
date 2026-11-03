export class Solution {
    minimumSubarrayLength(nums: number[], k: number): number {
        let best = Infinity;
        for (let i = 0; i < nums.length; i++) {
            let or = 0;
            for (let j = i; j < nums.length; j++) {
                or |= nums[j];
                if (or >= k) {
                    best = Math.min(best, j - i + 1);
                    break;
                }
            }
        }
        return best === Infinity ? -1 : best;
    }
}

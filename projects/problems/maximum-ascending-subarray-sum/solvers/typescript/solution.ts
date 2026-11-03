export class Solution {
    maxAscendingSum(nums: number[]): number {
        let best = nums[0];
        let cur = nums[0];
        for (let i = 1; i < nums.length; i++) {
            cur = nums[i] > nums[i - 1] ? cur + nums[i] : nums[i];
            best = Math.max(best, cur);
        }
        return best;
    }
}

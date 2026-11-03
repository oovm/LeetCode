export class Solution {
    getFinalState(nums: number[], k: number, multiplier: number): number[] {
        for (let t = 0; t < k; t++) {
            let best = 0;
            for (let i = 1; i < nums.length; i++) if (nums[i] < nums[best]) best = i;
            nums[best] *= multiplier;
        }
        return nums;
    }
}

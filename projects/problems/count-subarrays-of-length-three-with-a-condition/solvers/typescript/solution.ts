export class Solution {
    countSubarrays(nums: number[]): number {
        let count = 0;
        for (let i = 0; i + 2 < nums.length; i++) {
            if (2 * (nums[i] + nums[i + 2]) === nums[i + 1]) count++;
        }
        return count;
    }
}

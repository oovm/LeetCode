export class Solution {
    canBeIncreasing(nums: number[]): boolean {
        let removed = 0;
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] <= nums[i - 1]) {
                if (removed > 0) return false;
                removed++;
                if (i > 1 && nums[i] <= nums[i - 2]) nums[i] = nums[i - 1];
            }
        }
        return true;
    }
}

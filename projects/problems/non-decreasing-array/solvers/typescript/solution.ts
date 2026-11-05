export class Solution {
    checkPossibility(nums: number[]): boolean {
        let changed = false;
        for (let i = 1; i < nums.length; i++) {
            if (nums[i - 1] > nums[i]) {
                if (changed) {
                    return false;
                }
                changed = true;
                if (i >= 2 && nums[i - 2] > nums[i]) {
                    nums[i] = nums[i - 1];
                }
            }
        }
        return true;
    }
}

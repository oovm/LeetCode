export class Solution {
    minimumRightShifts(nums: number[]): number {
        const n = nums.length;
        let pivot = -1;
        for (let i = 1; i < n; i++) {
            if (nums[i] < nums[i - 1]) {
                if (pivot >= 0) return -1;
                pivot = i;
            }
        }
        if (pivot === -1) return 0;
        return nums[n - 1] <= nums[0] ? n - pivot : -1;
    }
}

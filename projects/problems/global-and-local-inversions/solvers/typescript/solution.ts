export class Solution {
    isIdealPermutation(nums: number[]): boolean {
        const n = nums.length;
        if (n <= 2) {
            return true;
        }
        let minFar = nums[n - 1];
        for (let index = n - 3; index >= 0; index--) {
            if (nums[index] > minFar) {
                return false;
            }
            minFar = Math.min(minFar, nums[index + 1]);
        }
        return true;
    }
}

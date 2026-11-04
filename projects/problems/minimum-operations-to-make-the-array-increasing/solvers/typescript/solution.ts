export class Solution {
    minOperations(nums: number[]): number {
        let ops = 0;
        let prev = nums[0];
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] <= prev) {
                ops += prev + 1 - nums[i];
                prev = prev + 1;
            } else {
                prev = nums[i];
            }
        }
        return ops;
    }
}

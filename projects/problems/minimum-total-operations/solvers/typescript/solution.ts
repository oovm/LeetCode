export class Solution {
    minOperations(nums: number[]): number {
        let ops = 0;
        for (let i = 1; i < nums.length; i++) {
            if (nums[i] !== nums[i - 1]) ops++;
        }
        return ops;
    }
}

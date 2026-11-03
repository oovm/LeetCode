export class Solution {
    minMoves2(nums: number[]): number {
        nums.sort((a, b) => a - b);
        const median = nums[nums.length >> 1];
        return nums.reduce((acc, x) => acc + Math.abs(x - median), 0);
    }
}

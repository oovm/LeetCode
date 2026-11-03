export class Solution {
    minimumCost(nums: number[]): number {
        const rest = nums.slice(1).sort((a, b) => a - b);
        return nums[0] + rest[0] + rest[1];
    }
}

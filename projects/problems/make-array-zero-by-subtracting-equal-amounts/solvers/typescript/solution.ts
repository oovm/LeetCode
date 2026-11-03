export class Solution {
    minimumOperations(nums: number[]): number {
        return new Set(nums.filter((x) => x > 0)).size;
    }
}

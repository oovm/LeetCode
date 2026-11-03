export class Solution {
    minOperations(nums: number[], k: number): number {
        if (nums.some((x) => x < k)) return -1;
        return new Set(nums.filter((x) => x > k)).size;
    }
}

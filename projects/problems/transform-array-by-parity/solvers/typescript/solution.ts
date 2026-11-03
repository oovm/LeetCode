export class Solution {
    transformArray(nums: number[]): number[] {
        return nums.map((x) => x % 2).sort((a, b) => a - b);
    }
}

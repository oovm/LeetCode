export class Solution {
    smallestRangeI(nums: number[], k: number): number {
        return Math.max(
            0,
            Math.max(...nums) - Math.min(...nums) - 2 * k
        );
    }
}

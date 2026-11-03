export class Solution {
    distinctDifferenceArray(nums: number[]): number[] {
        return nums.map((_, i) => {
            const prefix = new Set(nums.slice(0, i + 1)).size;
            const suffix = new Set(nums.slice(i + 1)).size;
            return prefix - suffix;
        });
    }
}

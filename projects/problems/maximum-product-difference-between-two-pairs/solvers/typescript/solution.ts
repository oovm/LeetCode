export class Solution {
    maxProductDifference(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => a - b);
        const n = sorted.length;
        return sorted[n - 1] * sorted[n - 2] - sorted[0] * sorted[1];
    }
}

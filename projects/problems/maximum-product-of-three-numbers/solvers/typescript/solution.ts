export class Solution {
    maximumProduct(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => a - b);
        const n = sorted.length;
        return Math.max(
            sorted[n - 1] * sorted[n - 2] * sorted[n - 3],
            sorted[0] * sorted[1] * sorted[n - 1]
        );
    }
}

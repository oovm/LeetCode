export class Solution {
    largestPerimeter(nums: number[]): number {
        const sorted = [...nums].sort((a, b) => b - a);
        for (let i = 0; i + 2 < sorted.length; i++) {
            if (sorted[i] < sorted[i + 1] + sorted[i + 2]) {
                return sorted[i] + sorted[i + 1] + sorted[i + 2];
            }
        }
        return 0;
    }
}

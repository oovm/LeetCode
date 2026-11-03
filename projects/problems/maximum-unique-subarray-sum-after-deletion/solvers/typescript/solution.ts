export class Solution {
    maxSum(nums: number[]): number {
        const unique = [...new Set(nums)];
        const positives = unique.filter((x) => x > 0);
        return positives.length > 0 ? positives.reduce((a, b) => a + b, 0) : Math.max(...unique);
    }
}

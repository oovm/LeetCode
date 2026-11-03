export class Solution {
    maxSubsequence(nums: number[], k: number): number[] {
        const indexed = nums.map((v, i) => [v, i] as const);
        const chosen = new Set(
            [...indexed].sort((a, b) => b[0] - a[0]).slice(0, k).map(([, i]) => i)
        );
        return nums.filter((_, i) => chosen.has(i));
    }
}

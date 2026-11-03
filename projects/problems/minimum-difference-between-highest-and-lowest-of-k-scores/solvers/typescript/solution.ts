export class Solution {
    minimumDifference(nums: number[], k: number): number {
        const sorted = [...nums].sort((a, b) => a - b);
        let best = Number.MAX_SAFE_INTEGER;
        for (let i = k - 1; i < sorted.length; i++) {
            best = Math.min(best, sorted[i] - sorted[i - k + 1]);
        }
        return best;
    }
}

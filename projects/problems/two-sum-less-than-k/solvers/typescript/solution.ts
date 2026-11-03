export class Solution {
    twoSumLessThanK(nums: number[], k: number): number {
        const sorted = [...nums].sort((a, b) => a - b);
        let lo = 0;
        let hi = sorted.length - 1;
        let best = -1;
        while (lo < hi) {
            const sum = sorted[lo] + sorted[hi];
            if (sum < k) {
                best = Math.max(best, sum);
                lo++;
            } else {
                hi--;
            }
        }
        return best;
    }
}

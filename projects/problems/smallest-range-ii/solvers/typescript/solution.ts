export class Solution {
    smallestRangeII(nums: number[], k: number): number {
        const ordered = nums.slice().sort((a, b) => a - b);
        const n = ordered.length;
        if (n <= 1) {
            return 0;
        }
        let best = ordered[n - 1] - ordered[0];
        for (let split = 1; split < n; split++) {
            const low = Math.min(ordered[0] + k, ordered[split] - k);
            const high = Math.max(ordered[split - 1] + k, ordered[n - 1] - k);
            best = Math.min(best, high - low);
        }
        return best;
    }
}

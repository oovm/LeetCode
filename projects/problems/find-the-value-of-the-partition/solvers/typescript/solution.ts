export class Solution {
    findValueOfPartition(nums: number[]): number {
        const ordered = [...nums].sort((a, b) => a - b);
        if (ordered.length < 2) return 0;

        let best = ordered[1] - ordered[0];
        for (let i = 2; i < ordered.length; i += 1) {
            best = Math.min(best, ordered[i] - ordered[i - 1]);
        }
        return best;
    }
}

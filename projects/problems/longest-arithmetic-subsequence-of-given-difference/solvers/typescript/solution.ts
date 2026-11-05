export class Solution {
    longestSubsequence(arr: number[], difference: number): number {
        const lengths = new Map<number, number>();
        let best = 1;
        for (const value of arr) {
            const length = (lengths.get(value - difference) ?? 0) + 1;
            lengths.set(value, length);
            best = Math.max(best, length);
        }
        return best;
    }
}

export class Solution {
    maxDistance(s: string, k: number): number {
        const counts: Record<string, number> = { N: 0, S: 0, E: 0, W: 0 };
        let best = 0;
        for (const ch of s) {
            counts[ch] += 1;
            const base = Math.abs(counts.N - counts.S) + Math.abs(counts.E - counts.W);
            const gain = Math.min(counts.N, counts.S) + Math.min(counts.E, counts.W);
            best = Math.max(best, base + 2 * Math.min(k, gain));
        }
        return best;
    }
}

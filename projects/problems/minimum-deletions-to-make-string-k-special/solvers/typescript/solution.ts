export class Solution {
    minimumDeletions(k: number, word: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of word) counts[ch.charCodeAt(0) - 97] += 1;
        const freqs = counts.filter((c) => c > 0);
        let best = Infinity;
        for (const low of freqs) {
            let deletions = 0;
            for (const f of freqs) {
                if (f < low) deletions += f;
                else if (f > low + k) deletions += f - (low + k);
            }
            best = Math.min(best, deletions);
        }
        return best;
    }
}

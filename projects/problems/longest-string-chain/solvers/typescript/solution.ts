export class Solution {
    longestStrChain(words: string[]): number {
        const isPredecessor = (short: string, longer: string) => {
            if (longer.length !== short.length + 1) {
                return false;
            }
            let si = 0;
            let li = 0;
            let skipped = 0;
            while (si < short.length) {
                if (short[si] !== longer[li]) {
                    skipped++;
                    if (skipped > 1) {
                        return false;
                    }
                } else {
                    si++;
                }
                li++;
            }
            return true;
        };
        const ordered = words.map((word, index) => ({ word, index })).sort((a, b) => a.word.length - b.word.length);
        const dp = new Array<number>(words.length).fill(1);
        let best = words.length === 0 ? 0 : 1;
        for (let position = 1; position < ordered.length; position++) {
            for (let earlier = 0; earlier < position; earlier++) {
                if (isPredecessor(ordered[earlier].word, ordered[position].word)) {
                    dp[ordered[position].index] = Math.max(dp[ordered[position].index], dp[ordered[earlier].index] + 1);
                }
            }
            best = Math.max(best, dp[ordered[position].index]);
        }
        return best;
    }
}

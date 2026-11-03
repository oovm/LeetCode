export class Solution {
    longestBeautifulSubstring(word: string): number {
        let best = 0;
        let run = 1;
        let distinct = 1;
        for (let i = 1; i < word.length; i++) {
            if (word[i] >= word[i - 1]) {
                run += 1;
                if (word[i] !== word[i - 1]) {
                    distinct += 1;
                }
            } else {
                run = 1;
                distinct = 1;
            }
            if (distinct === 5) {
                best = Math.max(best, run);
            }
        }
        return best;
    }
}

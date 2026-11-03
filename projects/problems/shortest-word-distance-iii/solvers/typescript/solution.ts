export class Solution {
    shortestWordDistance(wordsDict: string[], word1: string, word2: string): number {
        const same = word1 === word2;
        let i1 = -1;
        let i2 = -1;
        let best = Infinity;
        for (let i = 0; i < wordsDict.length; i++) {
            if (wordsDict[i] === word1) {
                if (same) i2 = i1;
                i1 = i;
            } else if (wordsDict[i] === word2) {
                i2 = i;
            }
            if (i1 >= 0 && i2 >= 0) best = Math.min(best, Math.abs(i1 - i2));
        }
        return best;
    }
}

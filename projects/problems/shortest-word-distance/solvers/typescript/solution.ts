export class Solution {
    shortestDistance(wordsDict: string[], word1: string, word2: string): number {
        let p1 = -1;
        let p2 = -1;
        let best = wordsDict.length;
        for (let i = 0; i < wordsDict.length; i++) {
            if (wordsDict[i] === word1) p1 = i;
            if (wordsDict[i] === word2) p2 = i;
            if (p1 >= 0 && p2 >= 0) {
                best = Math.min(best, Math.abs(p1 - p2));
            }
        }
        return best;
    }
}

export class Solution {
    maximumSubsequenceCount(text: string, pattern: string): number {
        const [a, b] = [pattern[0], pattern[1]];
        let pairs = 0;
        let countA = 0;
        let countB = 0;
        for (const ch of text) {
            if (ch === b) {
                pairs += countA;
                countB += 1;
            }
            if (ch === a) {
                countA += 1;
            }
        }
        return pairs + Math.max(countA, countB);
    }
}

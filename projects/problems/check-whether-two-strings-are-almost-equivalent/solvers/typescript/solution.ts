export class Solution {
    checkAlmostEquivalent(word1: string, word2: string): boolean {
        const diff = new Array<number>(26).fill(0);
        for (const ch of word1) {
            diff[ch.charCodeAt(0) - 97] += 1;
        }
        for (const ch of word2) {
            diff[ch.charCodeAt(0) - 97] -= 1;
        }
        return diff.every((d) => Math.abs(d) <= 3);
    }
}

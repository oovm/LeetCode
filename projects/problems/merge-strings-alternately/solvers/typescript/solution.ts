export class Solution {
    mergeAlternately(word1: string, word2: string): string {
        const out: string[] = [];
        const limit = Math.max(word1.length, word2.length);
        for (let i = 0; i < limit; i++) {
            if (i < word1.length) out.push(word1[i]);
            if (i < word2.length) out.push(word2[i]);
        }
        return out.join('');
    }
}

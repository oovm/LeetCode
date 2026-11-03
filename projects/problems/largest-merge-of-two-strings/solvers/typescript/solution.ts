export class Solution {
    largestMerge(word1: string, word2: string): string {
        const out: string[] = [];
        let i = 0;
        let j = 0;
        while (i < word1.length || j < word2.length) {
            if (word1.slice(i) > word2.slice(j)) {
                out.push(word1[i]);
                i += 1;
            } else {
                out.push(word2[j]);
                j += 1;
            }
        }
        return out.join('');
    }
}

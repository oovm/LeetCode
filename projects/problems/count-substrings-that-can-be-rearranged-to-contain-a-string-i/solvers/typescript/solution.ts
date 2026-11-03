export class Solution {
    validSubstringCount(word1: string, word2: string): number {
        const need = new Array<number>(26).fill(0);
        for (const ch of word2) need[ch.charCodeAt(0) - 97] += 1;
        let total = 0;
        let left = 0;
        const window = new Array<number>(26).fill(0);
        const covers = (): boolean => need.every((c, i) => window[i] >= c);
        for (let right = 0; right < word1.length; right++) {
            window[word1.charCodeAt(right) - 97] += 1;
            while (covers()) {
                total += word1.length - right;
                window[word1.charCodeAt(left) - 97] -= 1;
                left += 1;
            }
        }
        return total;
    }
}

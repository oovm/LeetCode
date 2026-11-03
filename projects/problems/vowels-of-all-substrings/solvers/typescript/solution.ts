export class Solution {
    countVowels(word: string): number {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let total = 0;
        for (let i = 0; i < word.length; i++) {
            if (vowels.has(word[i])) {
                total += (i + 1) * (word.length - i);
            }
        }
        return total;
    }
}

export class Solution {
    countVowelSubstrings(word: string): number {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        let count = 0;
        for (let i = 0; i < word.length; i++) {
            const seen = new Set<string>();
            for (let j = i; j < word.length; j++) {
                if (!vowels.has(word[j])) {
                    break;
                }
                seen.add(word[j]);
                if (seen.size === 5) {
                    count += 1;
                }
            }
        }
        return count;
    }
}

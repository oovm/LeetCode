export class Solution {
    toGoatLatin(sentence: string): string {
        const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
        return sentence
            .split(' ')
            .map((word, i) => {
                const head = vowels.has(word[0].toLowerCase()) ? word : word.slice(1) + word[0];
                return `${head}ma${'a'.repeat(i + 1)}`;
            })
            .join(' ');
    }
}

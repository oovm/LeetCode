export class Solution {
    reversePrefix(word: string, ch: string): string {
        const idx = word.indexOf(ch);
        if (idx === -1) {
            return word;
        }
        return [...word.slice(0, idx + 1)].reverse().join('') + word.slice(idx + 1);
    }
}

export class Solution {
    stringMatching(words: string[]): string[] {
        return words.filter((w, i) =>
            words.some((other, j) => i !== j && other.includes(w))
        );
    }
}

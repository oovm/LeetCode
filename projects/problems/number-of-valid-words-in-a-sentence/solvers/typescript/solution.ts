export class Solution {
    countValidWords(sentence: string): number {
        return sentence
            .trim()
            .split(/\s+/)
            .filter((word) => /^[a-z]*([a-z]-[a-z]+)?[a-z]*[.!,]?$/.test(word)).length;
    }
}

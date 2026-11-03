export class Solution {
    mostWordsFound(sentences: string[]): number {
        return Math.max(...sentences.map((s) => s.split(" ").length));
    }
}

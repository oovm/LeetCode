export class Solution {
    indexPairs(text: string, words: string[]): number[][] {
        const out: number[][] = [];
        for (const word of words) {
            let start = text.indexOf(word);
            while (start !== -1) {
                out.push([start, start + word.length - 1]);
                start = text.indexOf(word, start + 1);
            }
        }
        return out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    }
}

export class Solution {
    sortSentence(s: string): string {
        const words = s.split(' ');
        const placed = new Array<string>(words.length);
        for (const word of words) {
            placed[Number(word[word.length - 1]) - 1] = word.slice(0, -1);
        }
        return placed.join(' ');
    }
}

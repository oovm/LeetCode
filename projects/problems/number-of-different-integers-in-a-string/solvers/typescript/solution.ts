export class Solution {
    numDifferentIntegers(word: string): number {
        const seen = new Set<string>();
        for (const match of word.matchAll(/\d+/g)) {
            seen.add(match[0].replace(/^0+/, ''));
        }
        return seen.size;
    }
}

export class Solution {
    splitWordsBySeparator(words: string[], separator: string): string[] {
        return words.flatMap((w) => w.split(separator)).filter((w) => w.length > 0);
    }
}

export class Solution {
    removeAlmostEqualCharacters(word: string): number {
        let removed = 0;
        let i = 1;
        while (i < word.length) {
            if (Math.abs(word.charCodeAt(i) - word.charCodeAt(i - 1)) <= 1) {
                removed += 1;
                i += 2;
            } else {
                i += 1;
            }
        }
        return removed;
    }
}

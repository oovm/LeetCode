export class Solution {
    makeEqual(words: string[]): boolean {
        const count = new Array(26).fill(0);
        for (const word of words) {
            for (const c of word) count[c.charCodeAt(0) - 97]++;
        }
        return count.every((c) => c % words.length === 0);
    }
}

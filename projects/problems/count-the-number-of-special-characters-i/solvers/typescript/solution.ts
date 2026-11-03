export class Solution {
    numberOfSpecialChars(word: string): number {
        const seen = new Array<number>(26).fill(0);
        for (const ch of word) {
            const code = ch.charCodeAt(0);
            if (code >= 97 && code <= 122) seen[code - 97] |= 1;
            else if (code >= 65 && code <= 90) seen[code - 65] |= 2;
        }
        let count = 0;
        for (const mask of seen) {
            if (mask === 3) count += 1;
        }
        return count;
    }
}

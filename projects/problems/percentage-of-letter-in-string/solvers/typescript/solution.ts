export class Solution {
    percentageLetter(s: string, letter: string): number {
        let count = 0;
        for (const ch of s) {
            if (ch === letter) {
                count++;
            }
        }
        return Math.floor((count * 100) / s.length);
    }
}

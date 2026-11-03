export class Solution {
    countLetters(s: string): number {
        let total = 0;
        let run = 1;
        for (let i = 1; i <= s.length; i++) {
            if (i < s.length && s[i] === s[i - 1]) {
                run += 1;
            } else {
                total += (run * (run + 1)) / 2;
                run = 1;
            }
        }
        return total;
    }
}

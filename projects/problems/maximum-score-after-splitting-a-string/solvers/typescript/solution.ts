export class Solution {
    maxScore(s: string): number {
        let ones = 0;
        for (const ch of s) {
            if (ch === '1') ones += 1;
        }
        let best = 0;
        let zeros = 0;
        for (let i = 0; i < s.length - 1; i++) {
            if (s[i] === '0') zeros += 1;
            else ones -= 1;
            best = Math.max(best, zeros + ones);
        }
        return best;
    }
}

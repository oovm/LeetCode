export class Solution {
    minFlipsMonoIncr(s: string): number {
        let ones = 0;
        let flips = 0;
        for (const ch of s) {
            if (ch === '1') ones += 1;
            else if (ones > 0) {
                flips += 1;
                ones -= 1;
            }
        }
        return flips;
    }
}

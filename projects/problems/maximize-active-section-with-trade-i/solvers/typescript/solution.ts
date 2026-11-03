export class Solution {
    maxActiveSectionsAfterTrade(s: string): number {
        const ones = [...s].filter((c) => c === '1').length;
        let best = ones;
        let prevZero = 0;
        let i = 0;
        while (i < s.length) {
            if (s[i] === '0') {
                let j = i;
                while (j < s.length && s[j] === '0') j += 1;
                const len = j - i;
                if (prevZero > 0 && i < s.length && j < s.length) {
                    best = Math.max(best, ones + prevZero + len);
                }
                prevZero = len;
                i = j;
            } else {
                i += 1;
            }
        }
        return best;
    }
}

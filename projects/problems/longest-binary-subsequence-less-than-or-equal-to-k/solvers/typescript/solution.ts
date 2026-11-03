export class Solution {
    longestSubsequence(s: string, k: number): number {
        let value = 0;
        let taken = 0;
        for (let i = s.length - 1; i >= 0; i--) {
            if (s[i] === '0') {
                taken += 1;
            } else {
                const bit = s.length - 1 - i;
                if (bit < 31 && value + 2 ** bit <= k) {
                    value += 2 ** bit;
                    taken += 1;
                }
            }
        }
        return taken;
    }
}

export class Solution {
    countBinarySubstrings(s: string): number {
        let total = 0;
        let prev = 0;
        let cur = 1;
        for (let i = 1; i < s.length; i++) {
            if (s[i] === s[i - 1]) {
                cur += 1;
            } else {
                total += Math.min(prev, cur);
                prev = cur;
                cur = 1;
            }
        }
        return total + Math.min(prev, cur);
    }
}

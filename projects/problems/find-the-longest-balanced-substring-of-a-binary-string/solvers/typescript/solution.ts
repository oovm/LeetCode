export class Solution {
    findTheLongestBalancedSubstring(s: string): number {
        let best = 0;
        let prev = 0;
        let cur = 0;
        for (let i = 0; i < s.length; i++) {
            cur += 1;
            if (i === s.length - 1 || s[i] !== s[i + 1]) {
                if (s[i] === '1') {
                    best = Math.max(best, 2 * Math.min(prev, cur));
                }
                prev = cur;
                cur = 0;
            }
        }
        return best;
    }
}

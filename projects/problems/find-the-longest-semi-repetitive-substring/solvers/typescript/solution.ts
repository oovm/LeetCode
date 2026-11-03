export class Solution {
    longestSemiRepetitiveSubstring(s: string): number {
        let best = 1;
        let left = 0;
        let prevPair = -1;
        for (let right = 1; right < s.length; right++) {
            if (s[right] === s[right - 1]) {
                left = prevPair + 1;
                prevPair = right - 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}

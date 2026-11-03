export class Solution {
    longestRepeatingSubstring(s: string): number {
        const hasRepeat = (len: number): boolean => {
            const seen = new Set<string>();
            for (let i = 0; i + len <= s.length; i++) {
                const sub = s.slice(i, i + len);
                if (seen.has(sub)) {
                    return true;
                }
                seen.add(sub);
            }
            return false;
        };
        let lo = 0;
        let hi = s.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi + 1) / 2);
            if (hasRepeat(mid)) lo = mid;
            else hi = mid - 1;
        }
        return lo;
    }
}

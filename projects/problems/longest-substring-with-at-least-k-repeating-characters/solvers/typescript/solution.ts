export class Solution {
    longestSubstring(s: string, k: number): number {
        if (s.length < k) {
            return 0;
        }
        const counts = new Map<string, number>();
        for (const ch of s) {
            counts.set(ch, (counts.get(ch) ?? 0) + 1);
        }
        for (let i = 0; i < s.length; i++) {
            if ((counts.get(s[i]) ?? 0) < k) {
                return Math.max(
                    this.longestSubstring(s.slice(0, i), k),
                    this.longestSubstring(s.slice(i + 1), k),
                );
            }
        }
        return s.length;
    }
}

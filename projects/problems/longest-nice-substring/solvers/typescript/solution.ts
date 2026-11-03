export class Solution {
    longestNiceSubstring(s: string): string {
        if (s.length < 2) {
            return '';
        }
        const chars = new Set(s);
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (!chars.has(ch.toLowerCase()) || !chars.has(ch.toUpperCase())) {
                const left = this.longestNiceSubstring(s.slice(0, i));
                const right = this.longestNiceSubstring(s.slice(i + 1));
                return right.length > left.length ? right : left;
            }
        }
        return s;
    }
}

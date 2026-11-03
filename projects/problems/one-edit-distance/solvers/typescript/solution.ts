export class Solution {
    isOneEditDistance(s: string, t: string): boolean {
        const m = s.length;
        const n = t.length;
        if (m > n) {
            return this.isOneEditDistance(t, s);
        }
        if (n - m > 1) {
            return false;
        }
        for (let i = 0; i < m; i++) {
            if (s[i] !== t[i]) {
                return m === n ? s.slice(i + 1) === t.slice(i + 1) : s.slice(i) === t.slice(i + 1);
            }
        }
        return n - m === 1;
    }
}

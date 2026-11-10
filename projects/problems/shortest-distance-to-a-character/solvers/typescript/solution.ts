export class Solution {
    shortestToChar(s: string, c: string): number[] {
        const n = s.length;
        const out: number[] = new Array(n).fill(0);
        let prev = -n;
        for (let i = 0; i < n; i++) {
            if (s[i] === c) prev = i;
            out[i] = i - prev;
        }
        prev = 2 * n;
        for (let i = n - 1; i >= 0; i--) {
            if (s[i] === c) prev = i;
            out[i] = Math.min(out[i], prev - i);
        }
        return out;
    }
}

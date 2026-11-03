export class Solution {
    sumScores(s: string): number {
        const n = s.length;
        const z = new Array<number>(n).fill(0);
        let lo = 0;
        let hi = 0;
        for (let i = 1; i < n; i++) {
            if (i <= hi) {
                z[i] = Math.min(hi - i + 1, z[i - lo]);
            }
            while (i + z[i] < n && s[z[i]] === s[i + z[i]]) {
                z[i] += 1;
            }
            if (i + z[i] - 1 > hi) {
                lo = i;
                hi = i + z[i] - 1;
            }
        }
        return z.reduce((a, b) => a + b, 0) + n;
    }
}

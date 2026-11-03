export class Solution {
    countSubstrings(s: string, t: string): number {
        const n = s.length;
        const m = t.length;
        const left = Array.from({ length: n }, () => new Array<number>(m).fill(0));
        const right = Array.from({ length: n }, () => new Array<number>(m).fill(0));
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                left[i][j] = s[i] === t[j] ? 1 + (i > 0 && j > 0 ? left[i - 1][j - 1] : 0) : 0;
            }
        }
        for (let i = n - 1; i >= 0; i--) {
            for (let j = m - 1; j >= 0; j--) {
                right[i][j] = s[i] === t[j] ? 1 + (i + 1 < n && j + 1 < m ? right[i + 1][j + 1] : 0) : 0;
            }
        }
        let total = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                if (s[i] !== t[j]) {
                    const l = i > 0 && j > 0 ? left[i - 1][j - 1] : 0;
                    const r = i + 1 < n && j + 1 < m ? right[i + 1][j + 1] : 0;
                    total += (l + 1) * (r + 1);
                }
            }
        }
        return total;
    }
}

export class Solution {
    longestPalindrome(s: string, t: string): number {
        const radius = (x: string): number[][] => {
            const n = x.length;
            const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
            const from = new Array<number>(n).fill(0);
            const to = new Array<number>(n).fill(0);
            for (let i = n - 1; i >= 0; i--) {
                for (let j = i; j < n; j++) {
                    pal[i][j] = x[i] === x[j] && (j - i < 2 || pal[i + 1][j - 1]);
                    if (pal[i][j]) {
                        from[i] = Math.max(from[i], j - i + 1);
                        to[j] = Math.max(to[j], j - i + 1);
                    }
                }
            }
            return [from, to];
        };
        const [fromS] = radius(s);
        const [, toT] = radius(t);
        const n = s.length;
        const m = t.length;
        const lcp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = 0; j < m; j++) {
                if (s[i] === t[j]) lcp[i][j] = lcp[i + 1][j - 1] + 1;
            }
        }
        let best = 0;
        for (const v of fromS) best = Math.max(best, v);
        for (const v of toT) best = Math.max(best, v);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const len = lcp[i][j];
                if (len === 0) continue;
                const left = i - 1 >= 0 ? fromS[i - 1] : 0;
                const right = j + len < m ? toT[j + len] : 0;
                best = Math.max(best, 2 * len + Math.max(left, right));
            }
        }
        return best;
    }
}

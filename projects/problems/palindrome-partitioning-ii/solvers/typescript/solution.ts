export class Solution {
    minCut(s: string): number {
        const n = s.length;
        const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = i; j < n; j++) {
                pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
            }
        }
        const dp = new Array<number>(n + 1).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let best = n;
            for (let j = i; j < n; j++) {
                if (pal[i][j]) {
                    best = Math.min(best, 1 + dp[j + 1]);
                }
            }
            dp[i] = best;
        }
        return dp[0] - 1;
    }
}

export class Solution {
    longestPalindromicSubsequence(s: string, k: number): number {
        const n = s.length;
        const cost = (a: string, b: string): number =>
            Math.min(
                Math.abs(a.charCodeAt(0) - b.charCodeAt(0)),
                26 - Math.abs(a.charCodeAt(0) - b.charCodeAt(0)),
            );
        const dp: number[][][] = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => new Array<number>(k + 1).fill(0)),
        );
        for (let i = n - 1; i >= 0; i--) {
            for (let c = 0; c <= k; c++) {
                dp[i][i][c] = 1;
            }
            for (let j = i + 1; j < n; j++) {
                for (let c = 0; c <= k; c++) {
                    let best = Math.max(dp[i + 1][j][c], dp[i][j - 1][c]);
                    const need = cost(s[i], s[j]);
                    if (need <= c) {
                        best = Math.max(best, dp[i + 1][j - 1][c - need] + 2);
                    }
                    dp[i][j][c] = best;
                }
            }
        }
        return dp[0][n - 1][k];
    }
}

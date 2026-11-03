export class Solution {
    deleteString(s: string): number {
        const n = s.length;
        const lcp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                lcp[i][j] = s[i] === s[j] ? lcp[i + 1][j + 1] + 1 : 0;
            }
        }
        const dp = new Array<number>(n).fill(1);
        for (let i = n - 1; i >= 0; i--) {
            for (let len = 1; i + 2 * len <= n; len++) {
                if (lcp[i][i + len] >= len) {
                    dp[i] = Math.max(dp[i], 1 + dp[i + len]);
                }
            }
        }
        return dp[0];
    }
}

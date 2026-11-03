export class Solution {
    strangePrinter(s: string): number {
        const compact = s.replace(/(.)\1+/g, '$1');
        const n = compact.length;
        const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        for (let len = 1; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                const j = i + len - 1;
                dp[i][j] = len === 1 ? 1 : dp[i + 1][j] + 1;
                for (let k = i + 1; k <= j; k++) {
                    if (compact[k] === compact[i]) {
                        dp[i][j] = Math.min(dp[i][j], dp[i][k - 1] + dp[k][j]);
                    }
                }
            }
        }
        return dp[0][n - 1];
    }
}

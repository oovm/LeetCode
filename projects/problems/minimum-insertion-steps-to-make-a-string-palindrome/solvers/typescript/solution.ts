export class Solution {
    minInsertions(s: string): number {
        const n = s.length;
        const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        for (let len = 2; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                const j = i + len - 1;
                dp[i][j] =
                    s[i] === s[j]
                        ? dp[i + 1][j - 1]
                        : 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
            }
        }
        return dp[0][n - 1];
    }
}

export class Solution {
    palindromePartition(s: string, k: number): number {
        const n = s.length;
        const cost: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = i; j < n; j++) {
                cost[i][j] = (j - i > 0 ? cost[i + 1][j - 1] : 0) + (s[i] === s[j] ? 0 : 1);
            }
        }
        const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(Infinity));
        dp[0][0] = 0;
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= Math.min(i, k); j++) {
                for (let p = j - 1; p < i; p++) {
                    dp[i][j] = Math.min(dp[i][j], dp[p][j - 1] + cost[p][i - 1]);
                }
            }
        }
        return dp[n][k];
    }
}

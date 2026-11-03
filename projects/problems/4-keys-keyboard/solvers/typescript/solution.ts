export class Solution {
    maxA(n: number): number {
        const dp = new Array<number>(n + 1).fill(0);
        for (let i = 1; i <= n; i++) {
            dp[i] = (dp[i - 1] as number) + 1;
            for (let j = 1; j <= i - 3; j++) {
                dp[i] = Math.max(dp[i] as number, (dp[j] as number) * (i - j - 1));
            }
        }
        return dp[n] as number;
    }
}

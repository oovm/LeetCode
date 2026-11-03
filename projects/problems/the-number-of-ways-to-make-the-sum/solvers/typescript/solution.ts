export class Solution {
    numberOfWays(n: number): number {
        const MOD = 1000000007;
        const dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        for (const coin of [1, 2, 6]) {
            for (let sum = coin; sum <= n; sum++) {
                dp[sum] = ((dp[sum] as number) + (dp[sum - coin] as number)) % MOD;
            }
        }
        return dp[n] as number;
    }
}

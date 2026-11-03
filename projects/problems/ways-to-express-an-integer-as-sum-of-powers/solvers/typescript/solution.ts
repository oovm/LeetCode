export class Solution {
    numberOfWays(n: number, x: number): number {
        const MOD = 1000000007;
        const dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        for (let base = 1; Math.pow(base, x) <= n; base++) {
            const value = Math.pow(base, x);
            for (let sum = n; sum >= value; sum--) {
                dp[sum] = ((dp[sum] as number) + (dp[sum - value] as number)) % MOD;
            }
        }
        return dp[n] as number;
    }
}

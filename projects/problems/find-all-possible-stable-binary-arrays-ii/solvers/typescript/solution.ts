export class Solution {
    numberOfStableArrays(one: number, zero: number, limit: number): number {
        const MOD = 1000000007;
        const dp: number[][][] = Array.from({ length: one + 1 }, () =>
            Array.from({ length: zero + 1 }, () => [0, 0]),
        );
        for (let i = 1; i <= Math.min(one, limit); i++) dp[i][0][1] = 1;
        for (let j = 1; j <= Math.min(zero, limit); j++) dp[0][j][0] = 1;
        for (let i = 1; i <= one; i++) {
            for (let j = 1; j <= zero; j++) {
                dp[i][j][1] = (dp[i - 1][j][0] + dp[i - 1][j][1]) % MOD;
                if (i > limit) dp[i][j][1] = (dp[i][j][1] - dp[i - limit - 1][j][0] + MOD) % MOD;
                dp[i][j][0] = (dp[i][j - 1][0] + dp[i][j - 1][1]) % MOD;
                if (j > limit) dp[i][j][0] = (dp[i][j][0] - dp[i][j - limit - 1][1] + MOD) % MOD;
            }
        }
        return (dp[one][zero][0] + dp[one][zero][1]) % MOD;
    }
}

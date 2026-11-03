export class Solution {
    countPalindromicSubsequences(s: string): number {
        const MOD = 1000000007;
        const n = s.length;
        const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        for (let i = 0; i < n; i++) dp[i][i] = 1;
        for (let len = 2; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                const j = i + len - 1;
                if (s[i] !== s[j]) {
                    dp[i][j] = (dp[i + 1][j] + dp[i][j - 1] - dp[i + 1][j - 1] + MOD) % MOD;
                } else {
                    let lo = i + 1;
                    let hi = j - 1;
                    while (lo <= hi && s[lo] !== s[i]) lo += 1;
                    while (hi >= lo && s[hi] !== s[j]) hi -= 1;
                    if (lo > hi) {
                        dp[i][j] = (2 * dp[i + 1][j - 1] + 2) % MOD;
                    } else if (lo === hi) {
                        dp[i][j] = (2 * dp[i + 1][j - 1] + 1) % MOD;
                    } else {
                        dp[i][j] = (2 * dp[i + 1][j - 1] - dp[lo + 1][hi - 1] + MOD) % MOD;
                    }
                }
            }
        }
        return dp[0][n - 1];
    }
}

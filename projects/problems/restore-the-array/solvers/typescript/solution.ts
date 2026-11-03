export class Solution {
    numberOfArrays(s: string, k: number): number {
        const MOD = 1000000007;
        const n = s.length;
        const dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        for (let i = 0; i < n; i++) {
            if (s[i] === '0') continue;
            let value = 0;
            for (let j = i; j < n; j++) {
                value = value * 10 + (s.charCodeAt(j) - 48);
                if (value > k) break;
                dp[j + 1] = (dp[j + 1] + dp[i]) % MOD;
            }
        }
        return dp[n];
    }
}

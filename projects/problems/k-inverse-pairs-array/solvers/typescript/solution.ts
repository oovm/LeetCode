export class Solution {
    kInversePairs(n: number, k: number): number {
        const MOD = 1000000007;
        let dp = new Array<number>(k + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= n; i++) {
            const next = new Array<number>(k + 1).fill(0);
            let window = 0;
            for (let j = 0; j <= k; j++) {
                window = (window + (dp[j] as number)) % MOD;
                if (j >= i) {
                    window = (window - (dp[j - i] as number) + MOD) % MOD;
                }
                next[j] = window;
            }
            dp = next;
        }
        return dp[k] as number;
    }
}

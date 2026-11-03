export class Solution {
    numWays(arrLen: number, steps: number): number {
        const MOD = 1000000007;
        const limit = Math.min(arrLen, Math.floor(steps / 2) + 1);
        let dp = new Array<number>(limit).fill(0);
        dp[0] = 1;
        for (let step = 0; step < steps; step++) {
            const next = new Array<number>(limit).fill(0);
            for (let pos = 0; pos < limit; pos++) {
                next[pos] = dp[pos];
                if (pos > 0) next[pos] = (next[pos] + dp[pos - 1]) % MOD;
                if (pos < limit - 1) next[pos] = (next[pos] + dp[pos + 1]) % MOD;
            }
            dp = next;
        }
        return dp[0];
    }
}

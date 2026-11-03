export class Solution {
    numOfArrays(k: number, n: number, m: number): number {
        const MOD = 1000000007;
        let dp: number[][] = Array.from({ length: k + 1 }, () => new Array<number>(m + 1).fill(0));
        for (let v = 1; v <= m; v++) dp[1][v] = 1;
        for (let len = 2; len <= n; len++) {
            const next: number[][] = Array.from({ length: k + 1 }, () => new Array<number>(m + 1).fill(0));
            for (let j = 1; j <= Math.min(len, k); j++) {
                for (let hi = 1; hi <= m; hi++) {
                    let total = (dp[j][hi] * hi) % MOD;
                    for (let lower = 1; lower < hi; lower++) {
                        total = (total + dp[j - 1][lower]) % MOD;
                    }
                    next[j][hi] = total;
                }
            }
            dp = next;
        }
        return dp[k].reduce((a, b) => (a + b) % MOD, 0);
    }
}

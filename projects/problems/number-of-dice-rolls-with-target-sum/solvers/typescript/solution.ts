export class Solution {
    numRollsToTarget(n: number, k: number, target: number): number {
        const MOD = 1000000007;
        let dp = new Array<number>(target + 1).fill(0);
        dp[0] = 1;
        for (let roll = 0; roll < n; roll++) {
            const next = new Array<number>(target + 1).fill(0);
            for (let s = 1; s <= target; s++) {
                for (let face = 1; face <= k; face++) {
                    if (s >= face) next[s] = (next[s] + dp[s - face]) % MOD;
                }
            }
            dp = next;
        }
        return dp[target];
    }
}

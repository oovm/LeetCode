export class Solution {
    numRollsToTarget(n: number, k: number, target: number): number {
        const MOD = 1000000007;
        let dp = new Array<number>(target + 1).fill(0);
        dp[0] = 1;
        for (let dice = 0; dice < n; dice++) {
            const next = new Array<number>(target + 1).fill(0);
            for (let sum = 1; sum <= target; sum++) {
                for (let face = 1; face <= k && face <= sum; face++) {
                    next[sum] = ((next[sum] as number) + (dp[sum - face] as number)) % MOD;
                }
            }
            dp = next;
        }
        return dp[target] as number;
    }
}

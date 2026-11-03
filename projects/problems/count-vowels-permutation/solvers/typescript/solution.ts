export class Solution {
    countVowelPermutation(n: number): number {
        const MOD = 1000000007n;
        let dp = [1n, 1n, 1n, 1n, 1n];
        const moves: readonly number[][] = [[1], [0, 2], [0, 1, 3, 4], [2, 4], [0]];
        for (let step = 1; step < n; step++) {
            const next = [0n, 0n, 0n, 0n, 0n];
            for (let v = 0; v < 5; v++) {
                for (const from of moves[v]!) {
                    next[v] = ((next[v] as bigint) + (dp[from] as bigint)) % MOD;
                }
            }
            dp = next;
        }
        return Number(dp.reduce((sum, value) => (sum + value) % MOD, 0n));
    }
}

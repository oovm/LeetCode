export class Solution {
    knightDialer(n: number): number {
        const MOD = 1000000007;
        const moves: readonly number[][] = [[4, 6], [6, 8], [7, 9], [4, 8], [0, 3, 9], [], [0, 1, 7], [2, 6], [1, 3], [2, 4]];
        let dp = new Array<number>(10).fill(1);
        for (let step = 1; step < n; step++) {
            const next = new Array<number>(10).fill(0);
            for (let v = 0; v < 10; v++) {
                for (const from of moves[v]!) {
                    next[v] = ((next[v] as number) + (dp[from] as number)) % MOD;
                }
            }
            dp = next;
        }
        return dp.reduce((sum, value) => (sum + value) % MOD, 0);
    }
}

const MOD = 1000000007n;

export class Solution {
    countHousePlacements(n: number): number {
        let prev2 = 1n;
        let prev1 = 2n;
        for (let i = 2; i <= n; i++) {
            [prev2, prev1] = [prev1, (prev1 + prev2) % MOD];
        }
        return Number((prev1 * prev1) % MOD);
    }
}

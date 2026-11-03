export class Solution {
    findDerangement(n: number): number {
        const MOD = 1000000007;
        if (n === 1) {
            return 0;
        }
        let prev2 = 1;
        let prev1 = 0;
        for (let i = 2; i <= n; i++) {
            [prev2, prev1] = [prev1, ((i - 1) * (prev1 + prev2)) % MOD];
        }
        return prev1;
    }
}

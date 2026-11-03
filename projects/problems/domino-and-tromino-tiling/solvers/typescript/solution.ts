export class Solution {
    numTilings(n: number): number {
        const MOD = 1000000007;
        if (n === 1) return 1;
        if (n === 2) return 2;
        let f3 = 1;
        let f2 = 1;
        let f1 = 2;
        for (let i = 4; i <= n; i++) {
            [f3, f2, f1] = [f2, f1, (2 * f1 + f3) % MOD];
        }
        return f1;
    }
}

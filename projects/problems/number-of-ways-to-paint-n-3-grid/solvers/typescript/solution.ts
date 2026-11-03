export class Solution {
    numOfWays(n: number): number {
        const MOD = 1000000007;
        let aba = 6;
        let abc = 6;
        for (let i = 1; i < n; i++) {
            [aba, abc] = [(3 * aba + 2 * abc) % MOD, (2 * aba + 2 * abc) % MOD];
        }
        return (aba + abc) % MOD;
    }
}

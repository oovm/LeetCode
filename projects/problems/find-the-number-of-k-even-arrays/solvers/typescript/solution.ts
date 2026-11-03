export class Solution {
    countOfArrays(k: number, n: number, m: number): number {
        const MOD = 1000000007;
        const even = Math.floor(m / 2);
        const odd = m - even;
        let dpEven = new Array<number>(k + 1).fill(0);
        let dpOdd = new Array<number>(k + 1).fill(0);
        dpEven[0] = even;
        dpOdd[0] = odd;
        for (let i = 1; i < n; i++) {
            const nextEven = new Array<number>(k + 1).fill(0);
            const nextOdd = new Array<number>(k + 1).fill(0);
            for (let j = 0; j <= Math.min(i, k); j++) {
                nextEven[j] = (dpOdd[j] * even) % MOD;
                if (j > 0) nextEven[j] = (nextEven[j] + dpEven[j - 1] * even) % MOD;
                nextOdd[j] = ((dpEven[j] + dpOdd[j]) * odd) % MOD;
            }
            dpEven = nextEven;
            dpOdd = nextOdd;
        }
        return (dpEven[k] + dpOdd[k]) % MOD;
    }
}

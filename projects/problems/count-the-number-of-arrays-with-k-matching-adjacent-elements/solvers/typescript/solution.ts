export class Solution {
    countGoodArrays(n: number, m: number, k: number): number {
        const MOD = 1000000007n;
        const modPow = (base: bigint, exp: bigint): bigint => {
            let result = 1n;
            let b = base % MOD;
            let e = exp;
            while (e > 0n) {
                if (e % 2n === 1n) result = (result * b) % MOD;
                b = (b * b) % MOD;
                e /= 2n;
            }
            return result;
        };
        let c = 1n;
        for (let i = 1; i <= k; i++) {
            c = (((c * BigInt(n - i)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
        }
        return Number((((BigInt(m) * modPow(BigInt(m - 1), BigInt(n - 1 - k))) % MOD) * c) % MOD);
    }
}

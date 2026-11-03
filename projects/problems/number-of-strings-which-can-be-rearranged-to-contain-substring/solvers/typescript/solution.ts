export class Solution {
    stringCount(n: number): number {
        const MOD = 1000000007n;
        const modPow = (base: bigint, exp: bigint): bigint => {
            let result = 1n;
            let b = ((base % MOD) + MOD) % MOD;
            let e = exp;
            while (e > 0n) {
                if (e % 2n === 1n) result = (result * b) % MOD;
                b = (b * b) % MOD;
                e /= 2n;
            }
            return result;
        };
        const N = BigInt(n);
        let total = modPow(26n, N);
        total = (total + MOD - (3n * modPow(25n, N)) % MOD) % MOD;
        total = (total + MOD - ((N % MOD) * modPow(25n, N - 1n)) % MOD) % MOD;
        total = (total + (3n * modPow(24n, N)) % MOD) % MOD;
        total = (total + (2n * (N % MOD) * modPow(24n, N - 1n)) % MOD) % MOD;
        total = (total + MOD - modPow(23n, N)) % MOD;
        total = (total + MOD - ((N % MOD) * modPow(23n, N - 1n)) % MOD) % MOD;
        return Number(total);
    }
}

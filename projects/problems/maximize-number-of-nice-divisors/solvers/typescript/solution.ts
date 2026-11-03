export class Solution {
    maxNiceDivisors(primeFactors: number): number {
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
        const n = BigInt(primeFactors);
        if (n <= 3n) {
            return primeFactors;
        }
        if (n % 3n === 1n) {
            return Number((4n * modPow(3n, (n - 4n) / 3n)) % MOD);
        }
        if (n % 3n === 2n) {
            return Number((2n * modPow(3n, (n - 2n) / 3n)) % MOD);
        }
        return Number(modPow(3n, n / 3n));
    }
}

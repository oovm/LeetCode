export class Solution {
    numberOfWays(n: number, x: number, y: number): number {
        const MOD = 1000000007n;
        const modPow = (base: bigint, exp: bigint): bigint => {
            let result = 1n;
            let b = base % MOD;
            let e = exp;
            while (e > 0n) {
                if (e % 2n === 1n) {
                    result = (result * b) % MOD;
                }
                b = (b * b) % MOD;
                e /= 2n;
            }
            return result;
        };
        let total = 0n;
        let yk = 1n;
        let cxk = 1n;
        const lim = Math.min(n, x);
        for (let k = 1; k <= lim; k++) {
            cxk = (((cxk * BigInt(x - k + 1)) % MOD) * modPow(BigInt(k), MOD - 2n)) % MOD;
            yk = (yk * BigInt(y)) % MOD;
            let onto = 0n;
            let cki = 1n;
            for (let i = 0; i <= k; i++) {
                const term = (cki * modPow(BigInt(k - i), BigInt(n))) % MOD;
                onto = i % 2 === 0 ? (onto + term) % MOD : (onto + MOD - term) % MOD;
                cki = (((cki * BigInt(k - i)) % MOD) * modPow(BigInt(i + 1), MOD - 2n)) % MOD;
            }
            total = (total + ((cxk * onto) % MOD) * yk) % MOD;
        }
        return Number(total);
    }
}

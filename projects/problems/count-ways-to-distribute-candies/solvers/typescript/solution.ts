export class Solution {
    waysToDistribute(n: number, k: number): number {
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
        let sum = 0n;
        let cki = 1n;
        for (let i = 0; i <= k; i++) {
            const term = (cki * modPow(BigInt(k - i), BigInt(n))) % MOD;
            sum = i % 2 === 0 ? (sum + term) % MOD : (sum + MOD - term) % MOD;
            cki = (((cki * BigInt(k - i)) % MOD) * modPow(BigInt(i + 1), MOD - 2n)) % MOD;
        }
        let fact = 1n;
        for (let j = 2; j <= k; j++) {
            fact = (fact * BigInt(j)) % MOD;
        }
        return Number((sum * modPow(fact, MOD - 2n)) % MOD);
    }
}

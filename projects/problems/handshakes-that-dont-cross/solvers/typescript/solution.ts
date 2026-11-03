export class Solution {
    numberOfWays(numPeople: number): number {
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
        if (numPeople % 2 === 1) {
            return 0;
        }
        const m = numPeople / 2;
        let c = 1n;
        for (let i = 1; i <= m; i++) {
            c = (((c * BigInt(2 * m - i + 1)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
        }
        return Number((c * modPow(BigInt(m + 1), MOD - 2n)) % MOD);
    }
}

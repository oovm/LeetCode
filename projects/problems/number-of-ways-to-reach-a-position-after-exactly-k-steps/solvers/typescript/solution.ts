export class Solution {
    numberOfWays(startPos: number, endPos: number, k: number): number {
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
        const d = Math.abs(startPos - endPos);
        if (d > k || (k - d) % 2 !== 0) {
            return 0;
        }
        const r = (k - d) / 2;
        let c = 1n;
        for (let i = 1; i <= r; i++) {
            c = (((c * BigInt(k - i + 1)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
        }
        return Number(c);
    }
}

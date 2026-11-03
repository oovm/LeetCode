export class Solution {
    distanceSum(m: number, n: number, k: number): number {
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
        const nx = BigInt(n) % MOD;
        const mx = BigInt(m) % MOD;
        const px = (((nx * nx) % MOD) * ((BigInt(m) * (BigInt(m) * BigInt(m) - 1n)) / 6n) % MOD)) % MOD;
        const py = (((mx * mx) % MOD) * ((BigInt(n) * (BigInt(n) * BigInt(n) - 1n)) / 6n) % MOD)) % MOD;
        const pairs = (px + py) % MOD;
        const a = BigInt(m * n - 2);
        const b = BigInt(k - 2);
        let c = 1n;
        for (let i = 1n; i <= b; i++) {
            c = (((c * ((a - i + 1n) % MOD)) % MOD) * modPow(i, MOD - 2n)) % MOD;
        }
        return Number((c * pairs) % MOD);
    }
}

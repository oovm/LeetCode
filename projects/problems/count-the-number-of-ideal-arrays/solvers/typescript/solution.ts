export class Solution {
    idealArrays(n: number, maxValue: number): number {
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
        const choose = (a: number, b: number): bigint => {
            let result = 1n;
            for (let i = 1; i <= b; i++) {
                result = (((result * BigInt(a - i + 1)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
            }
            return result;
        };
        let total = 0n;
        for (let v = 1; v <= maxValue; v++) {
            let rest = v;
            let ways = 1n;
            for (let d = 2; d * d <= rest; d++) {
                if (rest % d === 0) {
                    let e = 0;
                    while (rest % d === 0) {
                        rest /= d;
                        e += 1;
                    }
                    ways = (ways * choose(n - 1 + e, e)) % MOD;
                }
            }
            if (rest > 1) {
                ways = (ways * choose(n, 1)) % MOD;
            }
            total = (total + ways) % MOD;
        }
        return Number(total);
    }
}

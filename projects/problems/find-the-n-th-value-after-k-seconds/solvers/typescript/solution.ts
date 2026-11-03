const MOD = 1000000007n;

function modPow(base: bigint, exp: bigint): bigint {
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
}

export class Solution {
    valueAfterKSeconds(n: number, k: number): number {
        let r = 1n;
        for (let i = 1; i <= k; i++) {
            r = (((r * BigInt(n + k - 1 - (k - i))) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
        }
        return Number(r);
    }
}

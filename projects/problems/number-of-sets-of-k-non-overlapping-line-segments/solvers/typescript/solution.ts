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

function combMod(a: number, b: number): number {
    if (b < 0 || b > a) {
        return 0;
    }
    let r = 1n;
    for (let i = 1; i <= b; i++) {
        r = (((r * BigInt(a - b + i)) % MOD) * modPow(BigInt(i), MOD - 2n)) % MOD;
    }
    return Number(r);
}

export class Solution {
    numberOfSets(n: number, k: number): number {
        return combMod(n + k - 1, 2 * k);
    }
}

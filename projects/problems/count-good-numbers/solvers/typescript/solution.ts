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
    countGoodNumbers(n: number): number {
        return Number((modPow(5n, BigInt(Math.ceil(n / 2))) * modPow(4n, BigInt(Math.floor(n / 2)))) % MOD);
    }
}

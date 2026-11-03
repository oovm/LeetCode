const MOD = 1000000007n;

export class Solution {
    maximumXorProduct(a: number, b: number, n: number): number {
        const mask = (1n << BigInt(n)) - 1n;
        let curA = BigInt(a) & ~mask;
        let curB = BigInt(b) & ~mask;
        const lowA = BigInt(a) & mask;
        const lowB = BigInt(b) & mask;
        for (let i = n - 1; i >= 0; i--) {
            const bit = 1n << BigInt(i);
            const bitA = (lowA & bit) !== 0n;
            const bitB = (lowB & bit) !== 0n;
            if (bitA === bitB) {
                curA += bit;
                curB += bit;
            } else if (curA < curB) {
                curA += bit;
            } else {
                curB += bit;
            }
        }
        return Number(((curA % MOD) * (curB % MOD)) % MOD);
    }
}

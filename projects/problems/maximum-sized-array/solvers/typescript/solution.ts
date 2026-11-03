function countSet(n: bigint, b: number): bigint {
    const cycle = 1n << BigInt(b + 1);
    const full = (n / cycle) * (cycle / 2n);
    const rem = n % cycle;
    const extra = rem - cycle / 2n;
    return extra < 0n ? full : full + extra;
}

function orPairSum(n: bigint): bigint {
    let total = 0n;
    for (let b = 0; 1n << BigInt(b) <= 2n * n; b++) {
        const set = countSet(n, b);
        const unset = n - set;
        total += (1n << BigInt(b)) * (n * n - unset * unset);
    }
    return total;
}

export class Solution {
    maxSizedArray(s: number): number {
        let n = 0n;
        const total = (v: bigint): bigint => (v * (v - 1n)) / 2n * orPairSum(v);
        while (total(n + 1n) <= BigInt(s)) {
            n += 1n;
        }
        return Number(n);
    }
}

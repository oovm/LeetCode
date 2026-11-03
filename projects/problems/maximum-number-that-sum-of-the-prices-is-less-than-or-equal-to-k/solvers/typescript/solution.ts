export class Solution {
    findMaximumNumber(k: number, x: number): number {
        const countBit = (n: bigint, p: number): bigint => {
            const cycle = 1n << BigInt(p);
            const full = ((n + 1n) / cycle) * (cycle / 2n);
            const rem = (n + 1n) % cycle;
            const extra = rem - cycle / 2n;
            return extra < 0n ? full : full + extra;
        };
        const priceSum = (n: bigint): bigint => {
            let total = 0n;
            for (let p = x; p <= 63; p += x) {
                total += countBit(n, p);
            }
            return total;
        };
        let low = 1n;
        let high = BigInt(k) * (1n << BigInt(x)) + (1n << BigInt(x));
        while (priceSum(high) <= BigInt(k)) {
            high *= 2n;
        }
        while (low < high) {
            const mid = (low + high + 1n) / 2n;
            if (priceSum(mid) <= BigInt(k)) {
                low = mid;
            } else {
                high = mid - 1n;
            }
        }
        return Number(low);
    }
}

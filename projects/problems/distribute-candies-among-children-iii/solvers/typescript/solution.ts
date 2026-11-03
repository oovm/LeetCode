export class Solution {
    distributeCandies(n: number, limit: number): number {
        const c2 = (x: bigint): bigint => (x < 2n ? 0n : (x * (x - 1n)) / 2n);
        const N = BigInt(n);
        const L = BigInt(limit);
        return Number(c2(N + 2n) - 3n * c2(N - L + 1n) + 3n * c2(N - 2n * L) - c2(N - 3n * L - 1n));
    }
}

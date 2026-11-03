const MOD = 1000000007n;

export class Solution {
    nthMagicalNumber(n: number, a: number, b: number): number {
        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const l = (a / gcd(a, b)) * b;
        let low = BigInt(Math.min(a, b));
        let high = BigInt(n) * low;
        while (low < high) {
            const mid = low + (high - low) / 2n;
            const count = mid / BigInt(a) + mid / BigInt(b) - mid / BigInt(l);
            if (count >= BigInt(n)) {
                high = mid;
            } else {
                low = mid + 1n;
            }
        }
        return Number(low % MOD);
    }
}

export class Solution {
    nthUglyNumber(n: number, a: number, b: number, c: number): number {
        const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
        const lcm = (x: number, y: number): number => (x / gcd(x, y)) * y;
        const ab = lcm(a, b);
        const ac = lcm(a, c);
        const bc = lcm(b, c);
        const abc = lcm(ab, c);
        const countLe = (x: number): number =>
            Math.floor(x / a) + Math.floor(x / b) + Math.floor(x / c) -
            Math.floor(x / ab) - Math.floor(x / ac) - Math.floor(x / bc) + Math.floor(x / abc);
        let low = Math.min(a, b, c);
        let high = low * n;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (countLe(mid) >= n) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}

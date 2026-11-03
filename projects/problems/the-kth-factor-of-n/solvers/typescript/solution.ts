export class Solution {
    kthFactor(n: number, k: number): number {
        let count = 0;
        let d = 1;
        for (; d * d <= n; d++) {
            if (n % d === 0 && ++count === k) {
                return d;
            }
        }
        d--;
        if (d * d === n) {
            d--;
        }
        for (; d >= 1; d--) {
            if (n % d === 0 && ++count === k) {
                return n / d;
            }
        }
        return -1;
    }
}

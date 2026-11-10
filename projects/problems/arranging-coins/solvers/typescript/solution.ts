export class Solution {
    arrangeCoins(n: number): number {
        let lo = 0;
        let hi = n;
        while (lo < hi) {
            const mid = Math.ceil((lo + hi) / 2);
            if (mid * (mid + 1) / 2 <= n) lo = mid;
            else hi = mid - 1;
        }
        return lo;
    }
}

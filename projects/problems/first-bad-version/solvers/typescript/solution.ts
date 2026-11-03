export class Solution {
    firstBadVersion(n: number, bad: number): number {
        let lo = 1;
        let hi = n;
        while (lo < hi) {
            const mid = lo + Math.floor((hi - lo) / 2);
            if (mid >= bad) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }
}

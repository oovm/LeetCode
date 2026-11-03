export class Solution {
    hIndex(citations: number[]): number {
        const n = citations.length;
        let lo = 0;
        let hi = n;
        while (lo < hi) {
            const mid = (lo + hi + 1) >> 1;
            if (citations[n - mid] >= mid) lo = mid;
            else hi = mid - 1;
        }
        return lo;
    }
}

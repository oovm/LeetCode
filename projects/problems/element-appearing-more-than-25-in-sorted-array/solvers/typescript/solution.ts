export class Solution {
    findSpecialInteger(arr: number[]): number {
        const n = arr.length;
        for (const offset of [0, Math.floor(n / 4), Math.floor(n / 2), Math.floor((3 * n) / 4)]) {
            const v = arr[Math.min(offset, n - 1)];
            let lo = 0;
            let hi = n;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (arr[mid] < v) lo = mid + 1;
                else hi = mid;
            }
            const first = lo;
            hi = n;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (arr[mid] <= v) lo = mid + 1;
                else hi = mid;
            }
            if (lo - first > n / 4) return v;
        }
        return arr[0];
    }
}

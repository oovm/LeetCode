export class Solution {
    missingNumber(arr: number[]): number {
        const n = arr.length;
        const step = (arr[n - 1] - arr[0]) / n;
        let lo = 0;
        let hi = n - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (arr[mid] === arr[0] + mid * step) lo = mid + 1;
            else hi = mid;
        }
        return arr[0] + lo * step;
    }
}

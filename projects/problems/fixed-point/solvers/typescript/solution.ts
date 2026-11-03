export class Solution {
    fixedPoint(arr: number[]): number {
        let lo = 0;
        let hi = arr.length - 1;
        let best = -1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (arr[mid] === mid) {
                best = mid;
                hi = mid - 1;
            } else if (arr[mid] < mid) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        return best;
    }
}

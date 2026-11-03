export class Solution {
    findKthPositive(arr: number[], k: number): number {
        let lo = 0;
        let hi = arr.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (arr[mid] - mid - 1 < k) lo = mid + 1;
            else hi = mid;
        }
        return lo + k;
    }
}

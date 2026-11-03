export class Solution {
    maxValue(n: number, index: number, maxSum: number): number {
        const sideSum = (h: number, cnt: number): number => {
            const peak = h - 1;
            if (peak >= cnt) {
                return ((peak + peak - cnt + 1) * cnt) / 2;
            }
            return ((1 + peak) * peak) / 2 + (cnt - peak);
        };
        const cost = (h: number): number => sideSum(h, index) + sideSum(h, n - 1 - index) + h;
        let low = 1;
        let high = maxSum;
        while (low < high) {
            const mid = Math.ceil((low + high) / 2);
            if (cost(mid) <= maxSum) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }
        return low;
    }
}

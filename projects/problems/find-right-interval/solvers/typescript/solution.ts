export class Solution {
    findRightInterval(intervals: number[][]): number[] {
        const starts = intervals.map(([s], i) => [s, i]).sort((a, b) => a[0] - b[0]);
        return intervals.map(([, e]) => {
            let lo = 0;
            let hi = starts.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (starts[mid][0] < e) lo = mid + 1;
                else hi = mid;
            }
            return lo === starts.length ? -1 : starts[lo][1];
        });
    }
}

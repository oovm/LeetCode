export class Solution {
    eraseOverlapIntervals(intervals: number[][]): number {
        intervals.sort((a, b) => a[1] - b[1]);
        let kept = 0;
        let end = -Infinity;
        for (const [s, e] of intervals) {
            if (s >= end) {
                kept++;
                end = e;
            }
        }
        return intervals.length - kept;
    }
}

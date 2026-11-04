export class Solution {
    removeCoveredIntervals(intervals: number[][]): number {
        const sorted = intervals
            .map(([start, end]) => [start, end] as const)
            .sort((a, b) => (a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]));
        let kept = 0;
        let reach = Number.NEGATIVE_INFINITY;
        for (const [, end] of sorted) {
            if (end > reach) {
                reach = end;
                kept++;
            }
        }
        return kept;
    }
}

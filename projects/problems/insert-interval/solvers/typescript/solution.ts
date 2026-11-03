export class Solution {
    insert(intervals: number[][], newInterval: number[]): number[][] {
        const result: number[][] = [];
        let [start, end] = newInterval;
        let inserted = false;
        for (const [s, e] of intervals) {
            if (e < start) result.push([s, e]);
            else if (s > end) {
                if (!inserted) {
                    result.push([start, end]);
                    inserted = true;
                }
                result.push([s, e]);
            } else {
                start = Math.min(start, s);
                end = Math.max(end, e);
            }
        }
        if (!inserted) result.push([start, end]);
        return result;
    }
}

export class Solution {
    minMeetingRooms(intervals: number[][]): number {
        const starts = intervals.map(([s]) => s).sort((a, b) => a - b);
        const ends = intervals.map(([, e]) => e).sort((a, b) => a - b);
        let rooms = 0;
        let e = 0;
        for (const s of starts) {
            if (s < ends[e]) rooms++;
            else e++;
        }
        return rooms;
    }
}

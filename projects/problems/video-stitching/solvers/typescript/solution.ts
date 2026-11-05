export class Solution {
    videoStitching(clips: number[][], time: number): number {
        const last = new Array<number>(time).fill(0);
        for (const [start, end] of clips) {
            if (start < time) {
                last[start] = Math.max(last[start], end);
            }
        }
        let pieces = 0;
        let farthest = 0;
        let coveredUntil = 0;
        for (let cursor = 0; cursor < time; cursor++) {
            farthest = Math.max(farthest, last[cursor]);
            if (farthest <= cursor) {
                return -1;
            }
            if (coveredUntil === cursor) {
                pieces++;
                coveredUntil = farthest;
            }
        }
        return pieces;
    }
}

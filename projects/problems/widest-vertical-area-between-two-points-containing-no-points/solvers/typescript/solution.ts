export class Solution {
    maxWidthOfVerticalArea(points: number[][]): number {
        const xs = points.map((p) => p[0]).sort((a, b) => a - b);
        let best = 0;
        for (let i = 1; i < xs.length; i++) {
            best = Math.max(best, xs[i] - xs[i - 1]);
        }
        return best;
    }
}

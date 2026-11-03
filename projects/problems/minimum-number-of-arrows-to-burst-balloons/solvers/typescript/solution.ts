export class Solution {
    findMinArrowShots(points: number[][]): number {
        points.sort((a, b) => a[1] - b[1]);
        let arrows = 0;
        let end = -Infinity;
        for (const [s, e] of points) {
            if (s > end) {
                arrows++;
                end = e;
            }
        }
        return arrows;
    }
}

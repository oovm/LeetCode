export class Solution {
    largestTriangleArea(points: number[][]): number {
        let best = 0;
        const n = points.length;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                for (let k = j + 1; k < n; k++) {
                    const [x1, y1] = points[i];
                    const [x2, y2] = points[j];
                    const [x3, y3] = points[k];
                    const area = Math.abs(
                        (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)
                    ) / 2;
                    best = Math.max(best, area);
                }
            }
        }
        return best;
    }
}

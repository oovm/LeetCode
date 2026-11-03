export class Solution {
    isConvex(points: number[][]): boolean {
        const n = points.length;
        let sign = 0;
        for (let i = 0; i < n; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[(i + 1) % n];
            const [x3, y3] = points[(i + 2) % n];
            const cross = (x2 - x1) * (y3 - y2) - (y2 - y1) * (x3 - x2);
            if (cross !== 0) {
                const s = Math.sign(cross);
                if (sign !== 0 && s !== sign) return false;
                sign = s;
            }
        }
        return true;
    }
}

export class Solution {
    nearestValidPoint(x: number, y: number, points: number[][]): number {
        let best = -1;
        let bestDist = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < points.length; i++) {
            const [a, b] = points[i];
            if (a !== x && b !== y) continue;
            const dist = Math.abs(a - x) + Math.abs(b - y);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        }
        return best;
    }
}

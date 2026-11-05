export class Solution {
    splitPainting(segments: number[][]): number[][] {
        const deltas = new Map<number, number>();
        for (const [start, end, color] of segments) {
            deltas.set(start, (deltas.get(start) ?? 0) + color);
            deltas.set(end, (deltas.get(end) ?? 0) - color);
        }
        const points = [...deltas.keys()].sort((a, b) => a - b);
        const result: number[][] = [];
        let running = 0;
        for (let i = 0; i + 1 < points.length; i += 1) {
            running += deltas.get(points[i])!;
            if (running !== 0) {
                result.push([points[i], points[i + 1], running]);
            }
        }
        return result;
    }
}

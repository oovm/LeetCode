export class Solution {
    numberOfBoomerangs(points: number[][]): number {
        let count = 0;
        for (const [x1, y1] of points) {
            const dist = new Map<number, number>();
            for (const [x2, y2] of points) {
                const d = (x1 - x2) ** 2 + (y1 - y2) ** 2;
                count += dist.get(d) ?? 0;
                dist.set(d, (dist.get(d) ?? 0) + 1);
            }
        }
        return count * 2;
    }
}

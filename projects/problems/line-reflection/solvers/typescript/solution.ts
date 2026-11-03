export class Solution {
    isReflected(points: number[][]): boolean {
        const minX = Math.min(...points.map(([x]) => x));
        const maxX = Math.max(...points.map(([x]) => x));
        const sum = minX + maxX;
        const set = new Set(points.map(([x, y]) => `${x},${y}`));
        return points.every(([x, y]) => set.has(`${sum - x},${y}`));
    }
}

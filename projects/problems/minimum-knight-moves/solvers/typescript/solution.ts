export class Solution {
    minKnightMoves(x: number, y: number): number {
        const targetX = Math.abs(x);
        const targetY = Math.abs(y);
        const moves = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]] as const;
        const visited = new Set<string>(['0,0']);
        let queue: [number, number][] = [[0, 0]];
        let steps = 0;
        while (queue.length > 0) {
            const next: [number, number][] = [];
            for (const [cx, cy] of queue) {
                if (cx === targetX && cy === targetY) {
                    return steps;
                }
                for (const [dx, dy] of moves) {
                    const nx = cx + dx;
                    const ny = cy + dy;
                    const key = `${nx},${ny}`;
                    if (visited.has(key) || nx < -2 || ny < -2) {
                        continue;
                    }
                    visited.add(key);
                    next.push([nx, ny]);
                }
            }
            queue = next;
            steps += 1;
        }
        return -1;
    }
}

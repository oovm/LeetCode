export class Solution {
    wallsAndGates(rooms: number[][]): void {
        const m = rooms.length;
        const n = rooms[0].length;
        const queue: number[] = [];
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (rooms[i][j] === 0) queue.push(i * n + j);
            }
        }
        for (let head = 0; head < queue.length; head++) {
            const i = Math.floor(queue[head] / n);
            const j = queue[head] % n;
            for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && rooms[ni][nj] === 2147483647) {
                    rooms[ni][nj] = rooms[i][j] + 1;
                    queue.push(ni * n + nj);
                }
            }
        }
    }
}

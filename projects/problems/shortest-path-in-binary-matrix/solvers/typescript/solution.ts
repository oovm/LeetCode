export class Solution {
    shortestPathBinaryMatrix(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return -1;
        const cols = rows;
        if (grid[0][0] !== 0 || grid[rows - 1][cols - 1] !== 0) return -1;

        const dist = new Array<number>(rows * cols).fill(-1);
        dist[0] = 1;
        const queue: number[] = [0];
        let head = 0;

        while (head < queue.length) {
            const cell = queue[head];
            head += 1;
            const row = Math.floor(cell / cols);
            const col = cell % cols;
            const current = dist[cell];
            for (let drow = -1; drow <= 1; drow += 1) {
                for (let dcol = -1; dcol <= 1; dcol += 1) {
                    if (drow === 0 && dcol === 0) continue;
                    const nextRow = row + drow;
                    const nextCol = col + dcol;
                    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) continue;
                    const next = nextRow * cols + nextCol;
                    if (grid[nextRow][nextCol] === 0 && dist[next] === -1) {
                        dist[next] = current + 1;
                        queue.push(next);
                    }
                }
            }
        }

        return dist[rows * cols - 1];
    }
}

export class Solution {
    closedIsland(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) return 0;
        const cols = grid[0].length;
        let closed = 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] !== 0) continue;
                let touchesEdge = false;
                const queue: number[] = [r * cols + c];
                grid[r][c] = 1;
                let head = 0;

                while (head < queue.length) {
                    const cell = queue[head++];
                    const cr = Math.floor(cell / cols);
                    const cc = cell % cols;
                    if (cr === 0 || cr === rows - 1 || cc === 0 || cc === cols - 1) {
                        touchesEdge = true;
                    }
                    const next: Array<[number, number]> = [
                        [cr - 1, cc],
                        [cr + 1, cc],
                        [cr, cc - 1],
                        [cr, cc + 1],
                    ];
                    for (const [nr, nc] of next) {
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0) {
                            grid[nr][nc] = 1;
                            queue.push(nr * cols + nc);
                        }
                    }
                }

                if (!touchesEdge) closed++;
            }
        }
        return closed;
    }
}

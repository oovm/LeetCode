export class Solution {
    colorBorder(grid: number[][], row: number, col: number, color: number): number[][] {
        const rows = grid.length;
        const cols = grid[0].length;
        const visited = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
        const original = grid[row][col];
        const paint = (i: number, j: number) => {
            visited[i][j] = 1;
            for (const [di, dj] of [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ]) {
                const x = i + di;
                const y = j + dj;
                if (x < 0 || y < 0 || x >= rows || y >= cols) {
                    grid[i][j] = color;
                } else if (visited[x][y] === 0) {
                    if (grid[x][y] === original) {
                        paint(x, y);
                    } else {
                        grid[i][j] = color;
                    }
                }
            }
        };
        paint(row, col);
        return grid;
    }
}

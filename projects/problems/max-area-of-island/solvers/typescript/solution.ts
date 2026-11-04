export class Solution {
    maxAreaOfIsland(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) {
            return 0;
        }
        const cols = grid[0].length;
        const sink = (row: number, col: number): number => {
            if (row < 0 || row >= rows || col < 0 || col >= cols || grid[row][col] !== 1) {
                return 0;
            }
            grid[row][col] = 0;
            return 1 + sink(row - 1, col) + sink(row + 1, col) + sink(row, col - 1) + sink(row, col + 1);
        };
        let best = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] === 1) {
                    best = Math.max(best, sink(row, col));
                }
            }
        }
        return best;
    }
}

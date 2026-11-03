export class Solution {
    matrixScore(grid: number[][]): number {
        const rows = grid.length;
        const cols = grid[0].length;
        let total = 0;
        for (let c = 0; c < cols; c++) {
            let ones = 0;
            for (let r = 0; r < rows; r++) {
                const value = grid[r][c];
                ones += grid[r][0] === 0 ? 1 - value : value;
            }
            total += Math.max(ones, rows - ones) * 2 ** (cols - 1 - c);
        }
        return total;
    }
}

export class Solution {
    minimumOperations(grid: number[][]): number {
        let ops = 0;
        for (let j = 0; j < grid[0].length; j++) {
            for (let i = 1; i < grid.length; i++) {
                if (grid[i][j] <= grid[i - 1][j]) {
                    ops += grid[i - 1][j] + 1 - grid[i][j];
                    grid[i][j] = grid[i - 1][j] + 1;
                }
            }
        }
        return ops;
    }
}

export class Solution {
    minPathSum(grid: number[][]): number {
        const m = grid.length;
        const n = grid[0].length;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (i === 0 && j === 0) continue;
                const fromUp = i > 0 ? grid[i - 1][j] : Infinity;
                const fromLeft = j > 0 ? grid[i][j - 1] : Infinity;
                grid[i][j] += Math.min(fromUp, fromLeft);
            }
        }
        return grid[m - 1][n - 1];
    }
}

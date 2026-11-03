export class Solution {
    countNegatives(grid: number[][]): number {
        const m = grid.length;
        const n = grid[0].length;
        let count = 0;
        let j = n - 1;
        for (let i = 0; i < m; i++) {
            while (j >= 0 && grid[i][j] < 0) j--;
            count += n - 1 - j;
        }
        return count;
    }
}

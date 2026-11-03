export class Solution {
    projectionArea(grid: number[][]): number {
        const n = grid.length;
        let area = 0;
        for (let i = 0; i < n; i++) {
            let rowMax = 0;
            let colMax = 0;
            for (let j = 0; j < n; j++) {
                if (grid[i][j] > 0) area++;
                rowMax = Math.max(rowMax, grid[i][j]);
                colMax = Math.max(colMax, grid[j][i]);
            }
            area += rowMax + colMax;
        }
        return area;
    }
}

export class Solution {
    surfaceArea(grid: number[][]): number {
        const n = grid.length;
        let area = 0;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const v = grid[i][j];
                if (v === 0) continue;
                area += 2;
                area += Math.max(v - (i > 0 ? grid[i - 1][j] : 0), 0);
                area += Math.max(v - (i + 1 < n ? grid[i + 1][j] : 0), 0);
                area += Math.max(v - (j > 0 ? grid[i][j - 1] : 0), 0);
                area += Math.max(v - (j + 1 < n ? grid[i][j + 1] : 0), 0);
            }
        }
        return area;
    }
}

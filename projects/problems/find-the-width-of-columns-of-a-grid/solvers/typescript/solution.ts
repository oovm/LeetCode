export class Solution {
    findColumnWidth(grid: number[][]): number[] {
        return grid[0].map((_, j) => Math.max(...grid.map((row) => String(row[j]).length)));
    }
}

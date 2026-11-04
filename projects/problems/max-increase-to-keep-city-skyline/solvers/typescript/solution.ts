export class Solution {
    maxIncreaseKeepingSkyline(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) {
            return 0;
        }
        const cols = grid[0].length;
        const rowMax = grid.map((row) => Math.max(...row));
        const colMax = new Array<number>(cols).fill(0);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                colMax[col] = Math.max(colMax[col], grid[row][col]);
            }
        }
        let total = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                total += Math.min(rowMax[row], colMax[col]) - grid[row][col];
            }
        }
        return total;
    }
}

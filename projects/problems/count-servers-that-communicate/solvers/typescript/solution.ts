export class Solution {
    countServers(grid: number[][]): number {
        const rows = grid.length;
        const cols = rows > 0 ? grid[0].length : 0;
        const rowCount = new Array<number>(rows).fill(0);
        const colCount = new Array<number>(cols).fill(0);

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                if (grid[row][col] === 1) {
                    rowCount[row] += 1;
                    colCount[col] += 1;
                }
            }
        }

        let total = 0;
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                if (grid[row][col] === 1 && (rowCount[row] > 1 || colCount[col] > 1)) {
                    total += 1;
                }
            }
        }
        return total;
    }
}

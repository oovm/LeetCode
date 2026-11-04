export class Solution {
    countCornerRectangles(grid: number[][]): number {
        const rows = grid.length;
        if (rows === 0) {
            return 0;
        }
        const cols = grid[0].length;
        let total = 0;
        for (let upper = 0; upper < rows; upper++) {
            for (let lower = upper + 1; lower < rows; lower++) {
                let shared = 0;
                for (let col = 0; col < cols; col++) {
                    if (grid[upper][col] === 1 && grid[lower][col] === 1) {
                        shared++;
                    }
                }
                total += (shared * (shared - 1)) / 2;
            }
        }
        return total;
    }
}

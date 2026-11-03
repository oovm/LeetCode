export class Solution {
    canMakeSquare(grid: string[][]): boolean {
        for (let i = 0; i + 1 < grid.length; i++) {
            for (let j = 0; j + 1 < grid[0].length; j++) {
                let b = 0;
                for (const [di, dj] of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
                    if (grid[i + di][j + dj] === "B") b++;
                }
                if (b !== 2) return true;
            }
        }
        return false;
    }
}

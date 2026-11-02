export class Solution {
    islandPerimeter(grid: number[][]): number {
        let perim = 0;
        for (let r = 0; r < grid.length; r += 1) {
            const row = grid[r];
            for (let c = 0; c < row.length; c += 1) {
                if (row[c] === 1) {
                    perim += 4;
                    if (r > 0 && grid[r - 1][c] === 1) {
                        perim -= 2;
                    }
                    if (c > 0 && row[c - 1] === 1) {
                        perim -= 2;
                    }
                }
            }
        }
        return perim;
    }
}

export class Solution {
    numIslands(grid: string[][]): number {
        const m = grid.length;
        const n = grid[0].length;
        const sink = (i: number, j: number) => {
            if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== "1") return;
            grid[i][j] = "0";
            sink(i + 1, j);
            sink(i - 1, j);
            sink(i, j + 1);
            sink(i, j - 1);
        };
        let count = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (grid[i][j] === "1") {
                    count++;
                    sink(i, j);
                }
            }
        }
        return count;
    }
}

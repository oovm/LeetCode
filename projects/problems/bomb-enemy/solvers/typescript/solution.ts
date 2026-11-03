export class Solution {
    maxKilledEnemies(grid: string[][]): number {
        const m = grid.length;
        const n = grid[0].length;
        let best = 0;
        let rowHits = 0;
        const colHits = new Array<number>(n).fill(0);
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (j === 0 || grid[i][j - 1] === "W") {
                    rowHits = 0;
                    for (let k = j; k < n && grid[i][k] !== "W"; k++) {
                        if (grid[i][k] === "E") rowHits++;
                    }
                }
                if (i === 0 || grid[i - 1][j] === "W") {
                    colHits[j] = 0;
                    for (let k = i; k < m && grid[k][j] !== "W"; k++) {
                        if (grid[k][j] === "E") colHits[j]++;
                    }
                }
                if (grid[i][j] === "0") best = Math.max(best, rowHits + colHits[j]);
            }
        }
        return best;
    }
}

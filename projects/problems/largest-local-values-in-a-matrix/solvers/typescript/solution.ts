export class Solution {
    largestLocal(grid: number[][]): number[][] {
        const n = grid.length;
        const result: number[][] = [];
        for (let i = 0; i + 2 < n; i++) {
            const row: number[] = [];
            for (let j = 0; j + 2 < n; j++) {
                let best = 0;
                for (let di = 0; di < 3; di++) {
                    for (let dj = 0; dj < 3; dj++) {
                        best = Math.max(best, grid[i + di][j + dj]);
                    }
                }
                row.push(best);
            }
            result.push(row);
        }
        return result;
    }
}

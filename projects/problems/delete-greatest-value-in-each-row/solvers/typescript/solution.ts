export class Solution {
    deleteGreatestValue(grid: number[][]): number {
        for (const row of grid) row.sort((a, b) => b - a);
        let sum = 0;
        for (let j = 0; j < grid[0].length; j++) {
            let best = 0;
            for (const row of grid) best = Math.max(best, row[j]);
            sum += best;
        }
        return sum;
    }
}

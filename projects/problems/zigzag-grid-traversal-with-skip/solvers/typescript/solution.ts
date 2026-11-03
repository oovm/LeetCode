export class Solution {
    zigzagTraversal(grid: number[][]): number[] {
        const result: number[] = [];
        for (let i = 0; i < grid.length; i++) {
            const row = i % 2 === 0 ? grid[i] : [...grid[i]].reverse();
            for (let j = 0; j < row.length; j++) {
                if ((i + j) % 2 === 0) result.push(row[j]);
            }
        }
        return result;
    }
}

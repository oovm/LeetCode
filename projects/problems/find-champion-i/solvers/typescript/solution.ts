export class Solution {
    findChampion(grid: number[][]): number {
        const n = grid.length;
        for (let i = 0; i < n; i++) {
            if (grid[i].every((v, j) => i === j || v === 1)) return i;
        }
        return -1;
    }
}

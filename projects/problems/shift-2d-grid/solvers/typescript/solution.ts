export class Solution {
    shiftGrid(grid: number[][], k: number): number[][] {
        const m = grid.length;
        const n = grid[0].length;
        const total = m * n;
        const shift = k % total;
        const out: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
        for (let i = 0; i < total; i++) {
            const target = (i + shift) % total;
            out[Math.floor(target / n)][target % n] =
                grid[Math.floor(i / n)][i % n];
        }
        return out;
    }
}

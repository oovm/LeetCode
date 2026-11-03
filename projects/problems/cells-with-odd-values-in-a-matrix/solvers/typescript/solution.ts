export class Solution {
    oddCells(m: number, n: number, indices: number[][]): number {
        const rows = new Array(m).fill(0);
        const cols = new Array(n).fill(0);
        for (const [r, c] of indices) {
            rows[r] ^= 1;
            cols[c] ^= 1;
        }
        const oddRows = rows.reduce((a, b) => a + b, 0);
        const oddCols = cols.reduce((a, b) => a + b, 0);
        return oddRows * (n - oddCols) + (m - oddRows) * oddCols;
    }
}

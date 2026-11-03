export class Solution {
    transpose(matrix: number[][]): number[][] {
        const m = matrix.length;
        const n = matrix[0].length;
        const out: number[][] = Array.from({ length: n }, () => new Array(m).fill(0));
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                out[j][i] = matrix[i][j];
            }
        }
        return out;
    }
}

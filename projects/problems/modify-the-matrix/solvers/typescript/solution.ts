export class Solution {
    modifiedMatrix(matrix: number[][]): number[][] {
        const m = matrix.length;
        const n = matrix[0].length;
        for (let j = 0; j < n; j++) {
            let best = -1;
            for (let i = 0; i < m; i++) best = Math.max(best, matrix[i][j]);
            for (let i = 0; i < m; i++) if (matrix[i][j] === -1) matrix[i][j] = best;
        }
        return matrix;
    }
}

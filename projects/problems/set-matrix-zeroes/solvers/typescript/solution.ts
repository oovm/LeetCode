export class Solution {
    setZeroes(matrix: number[][]): void {
        const m = matrix.length;
        const n = matrix[0].length;
        let firstRowZero = matrix[0].some((v) => v === 0);
        let firstColZero = matrix.some((row) => row[0] === 0);
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                if (matrix[i][j] === 0) {
                    matrix[i][0] = 0;
                    matrix[0][j] = 0;
                }
            }
        }
        for (let i = 1; i < m; i++) {
            for (let j = 1; j < n; j++) {
                if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
            }
        }
        if (firstRowZero) matrix[0].fill(0);
        if (firstColZero) for (const row of matrix) row[0] = 0;
    }
}

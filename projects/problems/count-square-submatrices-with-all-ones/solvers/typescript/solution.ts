export class Solution {
    countSquares(matrix: number[][]): number {
        const rows = matrix.length;
        const cols = matrix[0].length;
        let total = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (matrix[i][j] === 1 && i > 0 && j > 0) {
                    matrix[i][j] = Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
                }
                total += matrix[i][j];
            }
        }
        return total;
    }
}

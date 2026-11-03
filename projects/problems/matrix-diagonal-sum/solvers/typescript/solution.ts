export class Solution {
    diagonalSum(mat: number[][]): number {
        const n = mat.length;
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += mat[i][i] + mat[i][n - 1 - i];
        }
        if (n % 2 === 1) sum -= mat[n >> 1][n >> 1];
        return sum;
    }
}

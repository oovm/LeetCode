export class Solution {
    findDiagonalOrder(mat: number[][]): number[] {
        const m = mat.length;
        const n = mat[0].length;
        const result: number[] = [];
        for (let d = 0; d < m + n - 1; d++) {
            const diag: number[] = [];
            for (let i = Math.max(0, d - n + 1); i <= Math.min(d, m - 1); i++) {
                diag.push(mat[i][d - i]);
            }
            if (d % 2 === 0) diag.reverse();
            result.push(...diag);
        }
        return result;
    }
}

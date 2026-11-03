export class Solution {
    numSpecial(mat: number[][]): number {
        const m = mat.length;
        const n = mat[0].length;
        const rows = mat.map((row) => row.reduce((a, b) => a + b, 0));
        const cols = new Array(n).fill(0);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) cols[j] += mat[i][j];
        }
        let count = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (mat[i][j] === 1 && rows[i] === 1 && cols[j] === 1) count++;
            }
        }
        return count;
    }
}

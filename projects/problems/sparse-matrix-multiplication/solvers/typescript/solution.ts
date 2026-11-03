export class Solution {
    multiply(mat1: number[][], mat2: number[][]): number[][] {
        const m = mat1.length;
        const k = mat1[0].length;
        const n = mat2[0].length;
        const result = Array.from({ length: m }, () => new Array<number>(n).fill(0));
        for (let i = 0; i < m; i++) {
            for (let t = 0; t < k; t++) {
                if (mat1[i][t] === 0) continue;
                for (let j = 0; j < n; j++) result[i][j] += mat1[i][t] * mat2[t][j];
            }
        }
        return result;
    }
}

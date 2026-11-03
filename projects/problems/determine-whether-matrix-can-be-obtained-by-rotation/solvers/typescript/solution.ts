export class Solution {
    findRotation(mat: number[][], target: number[][]): boolean {
        const n = mat.length;
        const same = (get: (i: number, j: number) => number): boolean => {
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (get(i, j) !== target[i][j]) return false;
                }
            }
            return true;
        };
        return (
            same((i, j) => mat[i][j]) ||
            same((i, j) => mat[n - 1 - j][i]) ||
            same((i, j) => mat[n - 1 - i][n - 1 - j]) ||
            same((i, j) => mat[j][n - 1 - i])
        );
    }
}

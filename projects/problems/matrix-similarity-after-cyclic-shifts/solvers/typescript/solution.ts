export class Solution {
    areSimilar(mat: number[][], k: number): boolean {
        const n = mat[0].length;
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < n; j++) {
                if (mat[i][j] !== mat[i][(j + k) % n]) return false;
            }
        }
        return true;
    }
}

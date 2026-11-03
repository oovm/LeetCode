export class Solution {
    rowAndMaximumOnes(mat: number[][]): number[] {
        let bestRow = 0;
        let bestCount = 0;
        for (let i = 0; i < mat.length; i++) {
            const count = mat[i].reduce((a, b) => a + b, 0);
            if (count > bestCount) {
                bestCount = count;
                bestRow = i;
            }
        }
        return [bestRow, bestCount];
    }
}

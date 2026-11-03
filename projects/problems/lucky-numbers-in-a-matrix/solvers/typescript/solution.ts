export class Solution {
    luckyNumbers(matrix: number[][]): number[] {
        const out: number[] = [];
        for (let i = 0; i < matrix.length; i++) {
            const rowMin = Math.min(...matrix[i]);
            const j = matrix[i].indexOf(rowMin);
            let colMax = true;
            for (let r = 0; r < matrix.length; r++) {
                if (matrix[r][j] > rowMin) {
                    colMax = false;
                    break;
                }
            }
            if (colMax) out.push(rowMin);
        }
        return out;
    }
}

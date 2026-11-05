export class Solution {
    longestLine(mat: number[][]): number {
        const rows = mat.length;
        if (rows === 0) {
            return 0;
        }
        const cols = mat[0].length;
        if (cols === 0) {
            return 0;
        }
        const stride = cols + 2;
        const total = (rows + 2) * stride;
        const up = new Array<number>(total).fill(0);
        const left = new Array<number>(total).fill(0);
        const diagonal = new Array<number>(total).fill(0);
        const anti = new Array<number>(total).fill(0);
        let best = 0;
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= cols; col++) {
                if (mat[row - 1][col - 1] !== 0) {
                    const cell = row * stride + col;
                    up[cell] = up[cell - stride] + 1;
                    left[cell] = left[cell - 1] + 1;
                    diagonal[cell] = diagonal[cell - stride - 1] + 1;
                    anti[cell] = anti[cell - stride + 1] + 1;
                    best = Math.max(best, up[cell], left[cell], diagonal[cell], anti[cell]);
                }
            }
        }
        return best;
    }
}

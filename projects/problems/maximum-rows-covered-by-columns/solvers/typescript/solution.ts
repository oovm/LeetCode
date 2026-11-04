export class Solution {
    maximumRows(matrix: number[][], numSelect: number): number {
        const rows = matrix.length;
        const width = matrix[0].length;
        let best = 0;
        for (let mask = 0; mask < 1 << width; mask++) {
            let bits = 0;
            for (let col = 0; col < width; col++) {
                if ((mask >> col) & 1) {
                    bits++;
                }
            }
            if (bits !== numSelect) {
                continue;
            }
            let covered = 0;
            for (let row = 0; row < rows; row++) {
                let ok = true;
                for (let col = 0; col < width; col++) {
                    if (matrix[row][col] === 1 && (((mask >> col) & 1) === 0)) {
                        ok = false;
                        break;
                    }
                }
                if (ok) {
                    covered++;
                }
            }
            best = Math.max(best, covered);
        }
        return best;
    }
}

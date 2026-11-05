export class Solution {
    minFallingPathSum(matrix: number[][]): number {
        const height = matrix.length;
        if (height === 0) {
            return 0;
        }
        const width = matrix[0].length;
        if (width === 0) {
            return 0;
        }
        let previous = new Array<number>(width).fill(0);
        for (let row = 0; row < height; row++) {
            const cells = matrix[row];
            const current = new Array<number>(width).fill(0);
            for (let col = 0; col < cells.length && col < width; col++) {
                const low = Math.max(0, col - 1);
                const high = Math.min(width - 1, col + 1);
                let best = previous[low];
                for (let probe = low + 1; probe <= high; probe++) {
                    best = Math.min(best, previous[probe]);
                }
                current[col] = best + cells[col];
            }
            previous = current;
        }
        let best = previous[0];
        for (let scan = 1; scan < width; scan++) {
            best = Math.min(best, previous[scan]);
        }
        return best;
    }
}

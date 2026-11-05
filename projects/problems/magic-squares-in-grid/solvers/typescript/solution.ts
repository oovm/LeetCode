export class Solution {
    numMagicSquaresInside(grid: number[][]): number {
        const height = grid.length;
        const width = height > 0 ? grid[0].length : 0;
        let total = 0;
        for (let top = 0; top + 3 <= height; top++) {
            for (let left = 0; left + 3 <= width; left++) {
                total += this.check(grid, top, left);
            }
        }
        return total;
    }

    private check(grid: number[][], top: number, left: number): number {
        const seen = new Array<number>(10).fill(0);
        const rows = [0, 0, 0];
        const cols = [0, 0, 0];
        let diagonal = 0;
        let opposite = 0;
        for (let dr = 0; dr < 3; dr++) {
            for (let dc = 0; dc < 3; dc++) {
                const value = grid[top + dr][left + dc];
                if (value < 1 || value > 9) {
                    return 0;
                }
                seen[value]++;
                rows[dr] += value;
                cols[dc] += value;
                if (dr === dc) {
                    diagonal += value;
                }
                if (dr + dc === 2) {
                    opposite += value;
                }
            }
        }
        for (let digit = 1; digit <= 9; digit++) {
            if (seen[digit] !== 1) {
                return 0;
            }
        }
        if (diagonal !== opposite) {
            return 0;
        }
        for (let line = 0; line < 3; line++) {
            if (rows[line] !== diagonal || cols[line] !== diagonal) {
                return 0;
            }
        }
        return 1;
    }
}

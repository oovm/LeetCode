export class Solution {
    totalNQueens(n: number): number {
        const solve = (row: number, cols: number, d1: number, d2: number): number => {
            if (row === n) {
                return 1;
            }
            let count = 0;
            let avail = ((1 << n) - 1) & ~(cols | d1 | d2);
            while (avail) {
                const bit = avail & -avail;
                avail -= bit;
                count += solve(row + 1, cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1);
            }
            return count;
        };
        return solve(0, 0, 0, 0);
    }
}

export class Solution {
    maxCount(m: number, n: number, ops: number[][]): number {
        let minRow = m;
        let minCol = n;
        for (const [rowBound, colBound] of ops) {
            minRow = Math.min(minRow, rowBound);
            minCol = Math.min(minCol, colBound);
        }
        return minRow * minCol;
    }
}

export class Solution {
    searchMatrix(matrix: number[][], target: number): boolean {
        const m = matrix.length;
        const n = matrix[0].length;
        let lo = 0;
        let hi = m * n - 1;
        while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            const v = matrix[Math.floor(mid / n)][mid % n];
            if (v === target) return true;
            if (v < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
}

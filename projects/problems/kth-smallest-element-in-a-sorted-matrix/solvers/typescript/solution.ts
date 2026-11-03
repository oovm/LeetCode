export class Solution {
    kthSmallest(matrix: number[][], k: number): number {
        const n = matrix.length;
        let lo = matrix[0][0];
        let hi = matrix[n - 1][n - 1];
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            let count = 0;
            let j = n - 1;
            for (let i = 0; i < n; i++) {
                while (j >= 0 && matrix[i][j] > mid) j--;
                count += j + 1;
            }
            if (count < k) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}

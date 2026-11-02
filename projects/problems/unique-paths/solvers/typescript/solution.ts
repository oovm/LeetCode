export class Solution {
    uniquePaths(m: number, n: number): number {
        let k = m - 1;
        if (n - 1 < k) {
            k = n - 1;
        }
        const total = m + n - 2;
        let result = 1;
        for (let i = 1; i <= k; i += 1) {
            result = (result * (total - k + i)) / i;
        }
        return result;
    }
}

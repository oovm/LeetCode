export class Solution {
    maximalSquare(matrix: string[][]): number {
        const m = matrix.length;
        const n = matrix[0].length;
        const dp = new Array<number>(n + 1).fill(0);
        let best = 0;
        for (let i = 1; i <= m; i++) {
            let prev = 0;
            for (let j = 1; j <= n; j++) {
                const temp = dp[j];
                dp[j] = matrix[i - 1][j - 1] === "1" ? Math.min(prev, dp[j], dp[j - 1]) + 1 : 0;
                best = Math.max(best, dp[j]);
                prev = temp;
            }
        }
        return best * best;
    }
}

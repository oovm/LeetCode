export class Solution {
    longestPalindrome(word1: string, word2: string): number {
        const combined = word1 + word2;
        const n = combined.length;
        const m = word1.length;
        const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        let best = 0;
        for (let i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            for (let j = i + 1; j < n; j++) {
                if (combined[i] === combined[j]) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                    if (i < m && j >= m) {
                        best = Math.max(best, dp[i][j]);
                    }
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                }
            }
        }
        return best;
    }
}

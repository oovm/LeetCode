export class Solution {
    longestPalindromeSubseq(s: string): number {
        const n = s.length;
        const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        const pair: string[][] = Array.from({ length: n }, () => new Array<string>(n).fill(''));
        for (let i = n - 1; i >= 0; i--) {
            dp[i][i] = 1;
            pair[i][i] = s[i];
            for (let j = i + 1; j < n; j++) {
                if (s[i] === s[j] && (dp[i + 1][j - 1] === 0 || pair[i + 1][j - 1] !== s[i])) {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                    pair[i][j] = s[i];
                } else if (dp[i + 1][j] >= dp[i][j - 1]) {
                    dp[i][j] = dp[i + 1][j];
                    pair[i][j] = pair[i + 1][j];
                } else {
                    dp[i][j] = dp[i][j - 1];
                    pair[i][j] = pair[i][j - 1];
                }
            }
        }
        return dp[0][n - 1];
    }
}

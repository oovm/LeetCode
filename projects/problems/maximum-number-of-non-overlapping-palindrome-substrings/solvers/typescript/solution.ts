export class Solution {
    maxPalindromes(s: string, k: number): number {
        const n = s.length;
        const pal: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));
        for (let i = n - 1; i >= 0; i--) {
            for (let j = i; j < n; j++) {
                pal[i][j] = s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1]);
            }
        }
        const dp = new Array<number>(n + 1).fill(0);
        for (let end = 1; end <= n; end++) {
            dp[end] = dp[end - 1];
            for (let start = 0; start + k <= end; start++) {
                if (pal[start][end - 1]) {
                    dp[end] = Math.max(dp[end], dp[start] + 1);
                }
            }
        }
        return dp[n];
    }
}

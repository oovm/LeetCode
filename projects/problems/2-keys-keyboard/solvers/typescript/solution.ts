export class Solution {
    minSteps(n: number): number {
        if (n <= 1) return 0;
        const dp: number[] = new Array(n + 1).fill(0);
        for (let i = 2; i <= n; i++) {
            dp[i] = i;
            for (let j = 2; j <= i; j++) {
                if (i % j === 0) {
                    dp[i] = Math.min(dp[i], dp[j] + i / j);
                }
            }
        }
        return dp[n];
    }
}

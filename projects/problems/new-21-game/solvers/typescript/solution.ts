export class Solution {
    new21Game(k: number, n: number, maxPts: number): number {
        if (k === 0 || n >= k + maxPts) {
            return 1;
        }
        const dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        let windowSum = 1;
        let total = 0;
        for (let i = 1; i <= n; i++) {
            dp[i] = windowSum / maxPts;
            if (i < k) windowSum += dp[i];
            else total += dp[i];
            if (i - maxPts >= 0 && i - maxPts < k) windowSum -= dp[i - maxPts];
        }
        return total;
    }
}

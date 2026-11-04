export class Solution {
    maxSumAfterPartitioning(arr: number[], k: number): number {
        const n = arr.length;
        const dp = new Array<number>(n + 1).fill(0);
        for (let i = 1; i <= n; i += 1) {
            let maximum = 0;
            for (let j = i; j > Math.max(0, i - k); j -= 1) {
                maximum = Math.max(maximum, arr[j - 1]);
                dp[i] = Math.max(dp[i], dp[j - 1] + maximum * (i - j + 1));
            }
        }
        return dp[n];
    }
}

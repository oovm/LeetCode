export class Solution {
    minOperations(x: number, s1: string, s2: string): number {
        const diff: number[] = [];
        for (let i = 0; i < s1.length; i++) {
            if (s1[i] !== s2[i]) diff.push(i);
        }
        const m = diff.length;
        if (m % 2 === 1) {
            return -1;
        }
        const dp = new Array<number>(m + 1).fill(Infinity);
        dp[0] = 0;
        for (let i = 2; i <= m; i += 2) {
            dp[i] = dp[i - 2] + Math.min(x, diff[i - 1] - diff[i - 2]);
            if (i >= 4) {
                dp[i] = Math.min(
                    dp[i],
                    dp[i - 4] +
                        Math.min(x, diff[i - 1] - diff[i - 4]) +
                        Math.min(x, diff[i - 2] - diff[i - 3]),
                );
            }
        }
        return dp[m];
    }
}

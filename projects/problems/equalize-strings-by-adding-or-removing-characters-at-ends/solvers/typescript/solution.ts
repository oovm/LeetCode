export class Solution {
    minOperations(initial: string, target: string): number {
        const m = initial.length;
        const n = target.length;
        const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
        let best = 0;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (initial[i - 1] === target[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    best = Math.max(best, dp[i][j]);
                }
            }
        }
        return m + n - 2 * best;
    }
}

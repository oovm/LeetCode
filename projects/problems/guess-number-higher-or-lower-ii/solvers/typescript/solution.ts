export class Solution {
    getMoneyAmount(n: number): number {
        const dp = Array.from({ length: n + 1 }, () => new Array<number>(n + 1).fill(0));
        for (let length = 2; length <= n; length++) {
            for (let low = 1; low + length - 1 <= n; low++) {
                const high = low + length - 1;
                let best = Number.POSITIVE_INFINITY;
                for (let guess = low; guess < high; guess++) {
                    best = Math.min(best, guess + Math.max(dp[low]![guess - 1] as number, dp[guess + 1]![high] as number));
                }
                dp[low]![high] = best === Number.POSITIVE_INFINITY ? 0 : best;
            }
        }
        return dp[1]![n] as number;
    }
}

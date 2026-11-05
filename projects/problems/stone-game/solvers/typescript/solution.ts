export class Solution {
    stoneGame(piles: number[]): boolean {
        const n = piles.length;
        const dp = new Array<number>(n * n).fill(0);
        for (let span = 1; span <= n; span++) {
            for (let left = 0; left + span <= n; left++) {
                const right = left + span - 1;
                if (span === 1) {
                    dp[left * n + right] = piles[left];
                } else {
                    const takeLeft = piles[left] - dp[(left + 1) * n + right];
                    const takeRight = piles[right] - dp[left * n + right - 1];
                    dp[left * n + right] = Math.max(takeLeft, takeRight);
                }
            }
        }
        return dp[n - 1] > 0;
    }
}

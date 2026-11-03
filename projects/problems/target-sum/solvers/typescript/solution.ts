export class Solution {
    findTargetSumWays(nums: number[], target: number): number {
        const total = nums.reduce((a, b) => a + b, 0);
        if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
        const pos = (total + target) / 2;
        const dp = new Array<number>(pos + 1).fill(0);
        dp[0] = 1;
        for (const x of nums) {
            for (let t = pos; t >= x; t--) dp[t] += dp[t - x];
        }
        return dp[pos];
    }
}

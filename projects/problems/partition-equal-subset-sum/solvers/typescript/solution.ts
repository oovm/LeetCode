export class Solution {
    canPartition(nums: number[]): boolean {
        const total = nums.reduce((a, b) => a + b, 0);
        if (total % 2 !== 0) return false;
        const target = total / 2;
        const dp = new Array<boolean>(target + 1).fill(false);
        dp[0] = true;
        for (const x of nums) {
            for (let t = target; t >= x; t--) dp[t] = dp[t] || dp[t - x];
        }
        return dp[target];
    }
}

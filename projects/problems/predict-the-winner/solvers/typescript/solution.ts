export class Solution {
    predictTheWinner(nums: number[]): boolean {
        const n = nums.length;
        const dp = [...nums];
        for (let len = 2; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                dp[i] = Math.max(nums[i] - dp[i + 1], nums[i + len - 1] - dp[i]);
            }
        }
        return dp[0] >= 0;
    }
}

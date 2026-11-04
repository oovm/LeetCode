export class Solution {
    maxResult(nums: number[], k: number): number {
        const count = nums.length;
        const dp = new Array<number>(count).fill(0);
        dp[0] = nums[0];
        const window: number[] = [0];
        for (let index = 1; index < count; index++) {
            while (window.length > 0 && window[0] + k < index) window.shift();
            dp[index] = nums[index] + dp[window[0]];
            while (window.length > 0 && dp[window[window.length - 1]] <= dp[index]) window.pop();
            window.push(index);
        }
        return dp[count - 1];
    }
}

export class Solution {
    waysToSplitArray(nums: number[]): number {
        const total = nums.reduce((sum, value) => sum + value, 0);
        let prefix = 0;
        let ways = 0;
        for (let i = 0; i + 1 < nums.length; i++) {
            prefix += nums[i];
            if (prefix >= total - prefix) ways += 1;
        }
        return ways;
    }
}

export class Solution {
    firstMissingPositive(nums: number[]): number {
        const n = nums.length;
        for (let i = 0; i < n; i++) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
                const target = nums[i] - 1;
                [nums[target], nums[i]] = [nums[i], nums[target]];
            }
        }
        for (let i = 0; i < n; i++) {
            if (nums[i] !== i + 1) {
                return i + 1;
            }
        }
        return n + 1;
    }
}

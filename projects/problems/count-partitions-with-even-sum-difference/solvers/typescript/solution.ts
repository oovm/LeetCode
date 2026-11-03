export class Solution {
    countPartitions(nums: number[]): number {
        const total = nums.reduce((a, b) => a + b, 0);
        let left = 0;
        let count = 0;
        for (let i = 0; i + 1 < nums.length; i++) {
            left += nums[i];
            if ((total - 2 * left) % 2 === 0) count++;
        }
        return count;
    }
}

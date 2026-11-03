export class Solution {
    largestSubarray(nums: number[], k: number): number[] {
        let start = 0;
        for (let i = 1; i + k <= nums.length; i++) {
            if (nums[i] > nums[start]) start = i;
        }
        return nums.slice(start, start + k);
    }
}

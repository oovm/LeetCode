export class Solution {
    hasIncreasingSubarrays(nums: number[], k: number): boolean {
        const increasingFrom = (s: number) => {
            for (let i = s + 1; i < s + k; i++) if (nums[i] <= nums[i - 1]) return false;
            return true;
        };
        for (let i = 0; i + 2 * k <= nums.length; i++) {
            if (increasingFrom(i) && increasingFrom(i + k)) return true;
        }
        return false;
    }
}

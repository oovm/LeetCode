export class Solution {
    kthSmallestSubarraySum(nums: number[], k: number): number {
        let low = nums[0];
        let high = 0;
        for (const value of nums) {
            high += value;
            low = Math.min(low, value);
        }

        const countSubarrays = (limit: number): boolean => {
            let total = 0;
            let left = 0;
            let running = 0;
            for (let right = 0; right < nums.length; right += 1) {
                running += nums[right];
                while (running > limit) {
                    running -= nums[left];
                    left += 1;
                }
                total += right - left + 1;
                if (total >= k) {
                    return true;
                }
            }
            return false;
        };

        while (low < high) {
            const middle = low + Math.floor((high - low) / 2);
            if (countSubarrays(middle)) {
                high = middle;
            } else {
                low = middle + 1;
            }
        }
        return low;
    }
}

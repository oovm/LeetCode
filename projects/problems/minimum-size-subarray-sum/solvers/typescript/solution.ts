export class Solution {
    minSubArrayLen(target: number, nums: number[]): number {
        let best = Infinity;
        let sum = 0;
        let left = 0;
        for (let right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left++];
            }
        }
        return best === Infinity ? 0 : best;
    }
}

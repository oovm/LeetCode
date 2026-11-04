export class Solution {
    longestSubarray(nums: number[], limit: number): number {
        const maxQueue: number[] = [];
        const minQueue: number[] = [];
        let maxHead = 0;
        let minHead = 0;
        let left = 0;
        let best = 0;
        for (let right = 0; right < nums.length; right += 1) {
            while (maxQueue.length > maxHead && nums[maxQueue[maxQueue.length - 1]] <= nums[right]) {
                maxQueue.pop();
            }
            maxQueue.push(right);

            while (minQueue.length > minHead && nums[minQueue[minQueue.length - 1]] >= nums[right]) {
                minQueue.pop();
            }
            minQueue.push(right);

            while (nums[maxQueue[maxHead]] - nums[minQueue[minHead]] > limit) {
                if (maxQueue[maxHead] === left) maxHead += 1;
                if (minQueue[minHead] === left) minHead += 1;
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}

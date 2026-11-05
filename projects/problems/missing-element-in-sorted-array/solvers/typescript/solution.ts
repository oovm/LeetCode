export class Solution {
    missingElement(nums: number[], k: number): number {
        const missing = (index: number) => nums[index] - nums[0] - index;
        const count = nums.length;
        const total = missing(count - 1);
        if (k > total) {
            return nums[count - 1] + k - total;
        }
        let low = 0;
        let high = count - 1;
        while (low < high) {
            const middle = (low + high) >> 1;
            if (missing(middle) >= k) {
                high = middle;
            } else {
                low = middle + 1;
            }
        }
        return nums[low - 1] + k - missing(low - 1);
    }
}

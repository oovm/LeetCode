export class Solution {
    findUnsortedSubarray(nums: number[]): number {
        const count = nums.length;
        if (count <= 1) {
            return 0;
        }
        let left = 0;
        while (left + 1 < count && nums[left] <= nums[left + 1]) {
            left += 1;
        }
        if (left + 1 >= count) {
            return 0;
        }
        let right = count - 1;
        while (right > 0 && nums[right - 1] <= nums[right]) {
            right -= 1;
        }
        let minimum = nums[left];
        for (let scan = left; scan <= right; scan++) {
            minimum = Math.min(minimum, nums[scan]);
        }
        let maximum = nums[right];
        for (let scan = 0; scan <= right; scan++) {
            maximum = Math.max(maximum, nums[scan]);
        }
        while (left > 0 && nums[left - 1] > minimum) {
            left -= 1;
        }
        while (right + 1 < count && nums[right + 1] < maximum) {
            right += 1;
        }
        return right - left + 1;
    }
}

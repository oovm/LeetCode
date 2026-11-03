export class Solution {
    findPeakElement(nums: number[]): number {
        let lo = 0;
        let hi = nums.length - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}

export class Solution {
    searchInsert(nums: number[], target: number): number {
        let lo = 0;
        let hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            const v = nums[mid];
            if (v === target) {
                return mid;
            }
            if (v < target) {
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
}

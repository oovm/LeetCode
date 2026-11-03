export class Solution {
    singleNonDuplicate(nums: number[]): number {
        let lo = 0;
        let hi = nums.length - 1;
        while (lo < hi) {
            const mid = lo + (((hi - lo) >> 1) & ~1);
            if (nums[mid] === nums[mid + 1]) lo = mid + 2;
            else hi = mid;
        }
        return nums[lo];
    }
}

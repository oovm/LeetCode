export class Solution {
    isMajorityElement(nums: number[], target: number): boolean {
        let lo = 0;
        let hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        const first = lo;
        lo = 0;
        hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] <= target) lo = mid + 1;
            else hi = mid;
        }
        return lo - first > nums.length / 2;
    }
}

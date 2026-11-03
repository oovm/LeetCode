export class Solution {
    searchRange(nums: number[], target: number): number[] {
        const bound = (lower: boolean) => {
            let lo = 0;
            let hi = nums.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (nums[mid] < target || (lower && nums[mid] === target)) hi = mid;
                else lo = mid + 1;
            }
            return lo;
        };
        const left = bound(true);
        if (left === nums.length || nums[left] !== target) return [-1, -1];
        return [left, bound(false) - 1];
    }
}

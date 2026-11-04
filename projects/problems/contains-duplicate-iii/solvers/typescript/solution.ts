export class Solution {
    containsNearbyAlmostDuplicate(nums: number[], indexDiff: number, valueDiff: number): boolean {
        const window: number[] = [];
        const lowerBound = (value: number): number => {
            let low = 0;
            let high = window.length;
            while (low < high) {
                const mid = (low + high) >> 1;
                if (window[mid] < value) low = mid + 1;
                else high = mid;
            }
            return low;
        };
        for (let i = 0; i < nums.length; i++) {
            if (i > indexDiff) {
                const expired = nums[i - indexDiff - 1];
                window.splice(lowerBound(expired), 1);
            }
            const at = lowerBound(nums[i]);
            if (at < window.length && window[at] - nums[i] <= valueDiff) return true;
            if (at > 0 && nums[i] - window[at - 1] <= valueDiff) return true;
            window.splice(at, 0, nums[i]);
        }
        return false;
    }
}

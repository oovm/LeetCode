export class Solution {
    hasIncreasingSubarrays(nums: number[], k: number): boolean {
        const count = nums.length;
        if (k === 0 || k * 2 > count) {
            return false;
        }
        const run = (start: number): number => {
            let length = 1;
            while (start + 1 < count && nums[start] < nums[start + 1]) {
                length++;
                start++;
            }
            return length;
        };
        for (let start = 0; start + k * 2 <= count; start++) {
            if (run(start) >= k && run(start + k) >= k) {
                return true;
            }
        }
        return false;
    }
}

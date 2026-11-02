export class Solution {
    dominantIndex(nums: number[]): number {
        let best = -1;
        let idx = -1;
        for (let i = 0; i < nums.length; i += 1) {
            if (nums[i] > best) {
                best = nums[i];
                idx = i;
            }
        }
        for (const v of nums) {
            if (v !== best && v * 2 > best) {
                return -1;
            }
        }
        return idx;
    }
}

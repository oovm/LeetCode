export class Solution {
    longestMonotonicSubarray(nums: number[]): number {
        let best = 1;
        let inc = 1;
        let dec = 1;
        for (let i = 1; i < nums.length; i++) {
            inc = nums[i] > nums[i - 1] ? inc + 1 : 1;
            dec = nums[i] < nums[i - 1] ? dec + 1 : 1;
            best = Math.max(best, inc, dec);
        }
        return best;
    }
}

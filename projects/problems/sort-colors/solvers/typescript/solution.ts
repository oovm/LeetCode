export class Solution {
    sortColors(nums: number[]): void {
        let lo = 0;
        let hi = nums.length - 1;
        let i = 0;
        while (i <= hi) {
            if (nums[i] === 0) [nums[i++], nums[lo++]] = [nums[lo], nums[i]];
            else if (nums[i] === 2) [nums[i], nums[hi--]] = [nums[hi], nums[i]];
            else i++;
        }
    }
}

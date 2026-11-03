export class Solution {
    numberOfArithmeticSlices(nums: number[]): number {
        let total = 0;
        let run = 0;
        for (let i = 2; i < nums.length; i++) {
            if (nums[i] - nums[i - 1] === nums[i - 1] - nums[i - 2]) {
                run++;
                total += run;
            } else run = 0;
        }
        return total;
    }
}

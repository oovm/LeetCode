export class Solution {
    sumOfGoodNumbers(nums: number[], k: number): number {
        let sum = 0;
        for (let i = 0; i < nums.length; i++) {
            const leftOk = i - k < 0 || nums[i] > nums[i - k];
            const rightOk = i + k >= nums.length || nums[i] > nums[i + k];
            if (leftOk && rightOk) sum += nums[i];
        }
        return sum;
    }
}

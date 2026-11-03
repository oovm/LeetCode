export class Solution {
    maxLength(nums: number[]): number {
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            let prod = 1;
            for (let j = i; j < nums.length; j++) {
                prod *= nums[j];
                if (prod === nums[i] * nums[j]) best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}

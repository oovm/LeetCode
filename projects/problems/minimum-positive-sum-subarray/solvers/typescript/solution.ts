export class Solution {
    minimumSumSubarray(nums: number[], l: number, r: number): number {
        let best = Infinity;
        for (let i = 0; i < nums.length; i++) {
            let sum = 0;
            for (let j = i; j < nums.length && j - i + 1 <= r; j++) {
                sum += nums[j];
                if (j - i + 1 >= l && sum > 0) best = Math.min(best, sum);
            }
        }
        return best === Infinity ? -1 : best;
    }
}

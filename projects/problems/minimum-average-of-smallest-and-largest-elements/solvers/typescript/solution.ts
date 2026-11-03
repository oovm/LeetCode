export class Solution {
    minimumAverage(nums: number[]): number {
        nums.sort((a, b) => a - b);
        let best = Infinity;
        for (let i = 0; i < nums.length / 2; i++) {
            best = Math.min(best, (nums[i] + nums[nums.length - 1 - i]) / 2);
        }
        return best;
    }
}

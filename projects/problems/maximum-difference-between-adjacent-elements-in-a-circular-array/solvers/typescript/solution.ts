export class Solution {
    maxAdjacentDistance(nums: number[]): number {
        let best = 0;
        for (let i = 0; i < nums.length; i++) {
            best = Math.max(best, Math.abs(nums[i] - nums[(i + 1) % nums.length]));
        }
        return best;
    }
}

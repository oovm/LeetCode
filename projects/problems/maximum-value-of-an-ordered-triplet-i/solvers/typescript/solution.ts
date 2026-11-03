export class Solution {
    maximumTripletValue(nums: number[]): number {
        let best = 0;
        let bestI = nums[0];
        let bestDiff = 0;
        for (let k = 1; k < nums.length; k++) {
            best = Math.max(best, bestDiff * nums[k]);
            bestDiff = Math.max(bestDiff, bestI - nums[k]);
            bestI = Math.max(bestI, nums[k]);
        }
        return best;
    }
}

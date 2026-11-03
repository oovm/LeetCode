export class Solution {
    minimumSum(nums: number[]): number {
        let best = Infinity;
        for (let j = 1; j + 1 < nums.length; j++) {
            let left = Infinity;
            for (let i = 0; i < j; i++) {
                if (nums[i] < nums[j]) left = Math.min(left, nums[i]);
            }
            let right = Infinity;
            for (let k = j + 1; k < nums.length; k++) {
                if (nums[k] < nums[j]) right = Math.min(right, nums[k]);
            }
            if (left < Infinity && right < Infinity) {
                best = Math.min(best, left + nums[j] + right);
            }
        }
        return best === Infinity ? -1 : best;
    }
}

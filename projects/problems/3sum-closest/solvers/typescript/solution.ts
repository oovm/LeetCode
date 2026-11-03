export class Solution {
    threeSumClosest(nums: number[], target: number): number {
        nums.sort((a, b) => a - b);
        let best = nums[0] + nums[1] + nums[2];
        for (let i = 0; i + 2 < nums.length; i++) {
            let lo = i + 1;
            let hi = nums.length - 1;
            while (lo < hi) {
                const sum = nums[i] + nums[lo] + nums[hi];
                if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
                if (sum < target) lo++;
                else if (sum > target) hi--;
                else return sum;
            }
        }
        return best;
    }
}

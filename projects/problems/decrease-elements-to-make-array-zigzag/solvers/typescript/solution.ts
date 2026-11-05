export class Solution {
    movesToMakeZigzag(nums: number[]): number {
        const cost = (start: number): number => {
            let total = 0;
            const n = nums.length;
            for (let i = start; i < n; i += 2) {
                let limit = Number.POSITIVE_INFINITY;
                if (i > 0) {
                    limit = Math.min(limit, nums[i - 1]);
                }
                if (i + 1 < n) {
                    limit = Math.min(limit, nums[i + 1]);
                }
                if (nums[i] > limit - 1) {
                    total += nums[i] - (limit - 1);
                }
            }
            return total;
        };
        return Math.min(cost(0), cost(1));
    }
}

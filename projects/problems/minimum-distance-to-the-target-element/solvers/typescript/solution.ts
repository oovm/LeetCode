export class Solution {
    getMinDistance(nums: number[], target: number, start: number): number {
        let best = Number.MAX_SAFE_INTEGER;
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === target) best = Math.min(best, Math.abs(i - start));
        }
        return best;
    }
}

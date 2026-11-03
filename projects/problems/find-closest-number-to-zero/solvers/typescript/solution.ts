export class Solution {
    findClosestNumber(nums: number[]): number {
        let best = nums[0];
        for (const v of nums) {
            if (Math.abs(v) < Math.abs(best) || (Math.abs(v) === Math.abs(best) && v > best)) {
                best = v;
            }
        }
        return best;
    }
}

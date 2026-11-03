export class Solution {
    maxProduct(nums: number[]): number {
        let best = nums[0];
        let hi = 1;
        let lo = 1;
        for (const x of nums) {
            [hi, lo] = [Math.max(x, hi * x, lo * x), Math.min(x, hi * x, lo * x)];
            best = Math.max(best, hi);
        }
        return best;
    }
}

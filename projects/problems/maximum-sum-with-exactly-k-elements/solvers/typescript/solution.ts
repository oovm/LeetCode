export class Solution {
    maximizeSum(nums: number[], k: number): number {
        const best = Math.max(...nums);
        return best * k + (k * (k - 1)) / 2;
    }
}

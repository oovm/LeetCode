export class Solution {
    findNonMinOrMax(nums: number[]): number {
        if (nums.length < 3) return -1;
        const [a, b, c] = nums;
        return a + b + c - Math.min(a, b, c) - Math.max(a, b, c);
    }
}

export class Solution {
    shuffle(nums: number[], n: number): number[] {
        const result: number[] = [];
        const limit = Math.min(n, nums.length - n);
        for (let i = 0; i < limit; i++) {
            result.push(nums[i], nums[i + n]);
        }
        return result;
    }
}

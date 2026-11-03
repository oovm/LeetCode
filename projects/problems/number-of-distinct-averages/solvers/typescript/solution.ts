export class Solution {
    distinctAverages(nums: number[]): number {
        nums.sort((a, b) => a - b);
        const sums = new Set<number>();
        for (let i = 0; i < nums.length / 2; i++) {
            sums.add(nums[i] + nums[nums.length - 1 - i]);
        }
        return sums.size;
    }
}

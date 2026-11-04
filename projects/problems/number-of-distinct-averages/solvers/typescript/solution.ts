export class Solution {
    distinctAverages(nums: number[]): number {
        const sums = new Set<number>();
        for (let left = 0; left < nums.length; left++) {
            for (let right = left + 1; right < nums.length; right++) {
                sums.add(nums[left] + nums[right]);
            }
        }
        return sums.size;
    }
}

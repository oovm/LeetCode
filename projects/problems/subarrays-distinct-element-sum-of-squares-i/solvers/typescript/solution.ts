export class Solution {
    sumCounts(nums: number[]): number {
        let total = 0;
        for (let i = 0; i < nums.length; i++) {
            const seen = new Set<number>();
            for (let j = i; j < nums.length; j++) {
                seen.add(nums[j]);
                total += seen.size * seen.size;
            }
        }
        return total;
    }
}

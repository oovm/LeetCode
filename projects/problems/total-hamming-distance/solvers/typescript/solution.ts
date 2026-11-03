export class Solution {
    totalHammingDistance(nums: number[]): number {
        let total = 0;
        for (let bit = 0; bit < 32; bit++) {
            let ones = 0;
            for (const x of nums) if ((x >> bit) & 1) ones++;
            total += ones * (nums.length - ones);
        }
        return total;
    }
}

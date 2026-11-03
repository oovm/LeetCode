export class Solution {
    averageValue(nums: number[]): number {
        let sum = 0;
        let count = 0;
        for (const x of nums) {
            if (x % 6 === 0) {
                sum += x;
                count++;
            }
        }
        return count === 0 ? 0 : Math.floor(sum / count);
    }
}

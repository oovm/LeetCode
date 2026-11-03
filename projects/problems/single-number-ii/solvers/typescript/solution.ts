export class Solution {
    singleNumber(nums: number[]): number {
        let ones = 0;
        let twos = 0;
        for (const x of nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
}

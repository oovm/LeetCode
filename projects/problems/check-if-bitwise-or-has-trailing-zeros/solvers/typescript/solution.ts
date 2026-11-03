export class Solution {
    hasTrailingZeros(nums: number[]): boolean {
        return nums.filter((x) => x % 2 === 0).length >= 2;
    }
}

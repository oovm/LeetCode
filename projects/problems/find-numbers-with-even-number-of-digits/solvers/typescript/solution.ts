export class Solution {
    findNumbers(nums: number[]): number {
        return nums.filter((v) => `${v}`.length % 2 === 0).length;
    }
}

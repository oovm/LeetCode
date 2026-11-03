export class Solution {
    minimumOperations(nums: number[]): number {
        return nums.filter((x) => x % 3 !== 0).length;
    }
}

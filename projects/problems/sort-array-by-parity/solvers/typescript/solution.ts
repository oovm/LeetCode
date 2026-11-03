export class Solution {
    sortArrayByParity(nums: number[]): number[] {
        return [
            ...nums.filter((v) => v % 2 === 0),
            ...nums.filter((v) => v % 2 !== 0),
        ];
    }
}

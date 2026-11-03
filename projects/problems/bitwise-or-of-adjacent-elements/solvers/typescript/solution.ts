export class Solution {
    orArray(nums: number[]): number[] {
        const result: number[] = [];
        for (let i = 0; i + 1 < nums.length; i++) result.push(nums[i] | nums[i + 1]);
        return result;
    }
}

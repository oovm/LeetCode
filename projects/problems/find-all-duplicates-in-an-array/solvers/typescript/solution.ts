export class Solution {
    findDuplicates(nums: number[]): number[] {
        const result: number[] = [];
        for (const x of nums) {
            const i = Math.abs(x) - 1;
            if (nums[i] < 0) result.push(Math.abs(x));
            else nums[i] = -nums[i];
        }
        return result;
    }
}

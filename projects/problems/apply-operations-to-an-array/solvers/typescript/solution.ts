export class Solution {
    applyOperations(nums: number[]): number[] {
        for (let i = 0; i + 1 < nums.length; i++) {
            if (nums[i] === nums[i + 1]) {
                nums[i] *= 2;
                nums[i + 1] = 0;
            }
        }
        const result = nums.filter((x) => x !== 0);
        while (result.length < nums.length) result.push(0);
        return result;
    }
}

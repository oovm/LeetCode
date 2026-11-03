export class Solution {
    createTargetArray(nums: number[], index: number[]): number[] {
        const out: number[] = [];
        for (let i = 0; i < nums.length; i++) {
            out.splice(index[i], 0, nums[i]);
        }
        return out;
    }
}

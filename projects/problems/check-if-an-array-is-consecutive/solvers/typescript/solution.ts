export class Solution {
    isConsecutive(nums: number[]): boolean {
        const set = new Set(nums);
        const min = Math.min(...nums);
        return set.size === nums.length && Math.max(...nums) - min + 1 === nums.length;
    }
}

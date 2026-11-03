export class Solution {
    targetIndices(nums: number[], target: number): number[] {
        const less = nums.filter((v) => v < target).length;
        const equal = nums.filter((v) => v === target).length;
        return Array.from({ length: equal }, (_, i) => less + i);
    }
}

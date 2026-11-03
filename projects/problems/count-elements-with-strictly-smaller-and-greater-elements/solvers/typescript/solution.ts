export class Solution {
    countElements(nums: number[]): number {
        const min = Math.min(...nums);
        const max = Math.max(...nums);
        return nums.filter((v) => v > min && v < max).length;
    }
}

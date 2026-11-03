export class Solution {
    minMoves(nums: number[]): number {
        const min = Math.min(...nums);
        return nums.reduce((acc, x) => acc + x - min, 0);
    }
}

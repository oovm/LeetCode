export class Solution {
    returnToBoundaryCount(nums: number[]): number {
        let position = 0;
        let count = 0;
        for (const step of nums) {
            position += step;
            if (position === 0) {
                count++;
            }
        }
        return count;
    }
}

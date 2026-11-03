export class Solution {
    returnToBoundaryCount(nums: number[]): number {
        let pos = 0;
        let count = 0;
        for (const x of nums) {
            pos += x;
            if (pos === 0) count++;
        }
        return count;
    }
}

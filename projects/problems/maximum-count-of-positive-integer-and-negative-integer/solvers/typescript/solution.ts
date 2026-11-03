export class Solution {
    maximumCount(nums: number[]): number {
        let pos = 0;
        let neg = 0;
        for (const x of nums) {
            if (x > 0) pos++;
            else if (x < 0) neg++;
        }
        return Math.max(pos, neg);
    }
}

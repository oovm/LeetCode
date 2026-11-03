export class Solution {
    arraySign(nums: number[]): number {
        let negatives = 0;
        for (const v of nums) {
            if (v === 0) return 0;
            if (v < 0) negatives++;
        }
        return negatives % 2 === 0 ? 1 : -1;
    }
}

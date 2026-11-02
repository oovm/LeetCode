export class Solution {
    findMaxConsecutiveOnes(nums: number[]): number {
        let best = 0;
        let cur = 0;
        for (const v of nums) {
            if (v === 1) {
                cur += 1;
                if (cur > best) {
                    best = cur;
                }
            } else {
                cur = 0;
            }
        }
        return best;
    }
}

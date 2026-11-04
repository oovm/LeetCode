export class Solution {
    zeroFilledSubarray(nums: number[]): number {
        let total = 0;
        let run = 0;
        for (const v of nums) {
            run = v === 0 ? run + 1 : 0;
            total += run;
        }
        return total;
    }
}

export class Solution {
    getMaxLen(nums: number[]): number {
        let positive = 0;
        let negative = 0;
        let best = 0;
        for (const value of nums) {
            if (value > 0) {
                positive++;
                if (negative > 0) {
                    negative++;
                }
            } else if (value < 0) {
                const nextPositive = negative === 0 ? 0 : negative + 1;
                const nextNegative = positive + 1;
                positive = nextPositive;
                negative = nextNegative;
            } else {
                positive = 0;
                negative = 0;
            }
            best = Math.max(best, positive);
        }
        return best;
    }
}

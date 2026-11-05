export class Solution {
    maxScoreSightseeingPair(values: number[]): number {
        let bestLeft = values[0];
        let best = -Infinity;
        for (let j = 1; j < values.length; j++) {
            best = Math.max(best, bestLeft + values[j] - j);
            bestLeft = Math.max(bestLeft, values[j] + j);
        }
        return best;
    }
}

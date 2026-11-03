export class Solution {
    maxSum(nums: number[]): number {
        const bestByDigit = new Array<number>(10).fill(-1);
        let best = -1;
        for (const x of nums) {
            const maxDigit = Math.max(...String(x).split("").map(Number));
            if (bestByDigit[maxDigit] >= 0) best = Math.max(best, bestByDigit[maxDigit] + x);
            bestByDigit[maxDigit] = Math.max(bestByDigit[maxDigit], x);
        }
        return best;
    }
}

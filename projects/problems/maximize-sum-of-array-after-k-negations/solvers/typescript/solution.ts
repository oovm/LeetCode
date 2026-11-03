export class Solution {
    largestSumAfterKNegations(nums: number[], k: number): number {
        const sorted = [...nums].sort((a, b) => a - b);
        for (let i = 0; i < sorted.length && k > 0; i++) {
            if (sorted[i] < 0) {
                sorted[i] = -sorted[i];
                k--;
            } else {
                break;
            }
        }
        if (k % 2 === 1) {
            let minIdx = 0;
            for (let i = 1; i < sorted.length; i++) {
                if (sorted[i] < sorted[minIdx]) minIdx = i;
            }
            sorted[minIdx] = -sorted[minIdx];
        }
        return sorted.reduce((a, b) => a + b, 0);
    }
}

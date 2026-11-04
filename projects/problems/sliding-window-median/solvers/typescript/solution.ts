export class Solution {
    slidingWindowMedian(nums: number[], k: number): number[] {
        const result: number[] = [];
        for (let i = 0; i + k <= nums.length; i++) {
            const window = nums.slice(i, i + k).sort((a, b) => a - b);
            result.push(
                k % 2 === 1
                    ? window[(k - 1) / 2]
                    : (window[k / 2 - 1] + window[k / 2]) / 2,
            );
        }
        return result;
    }
}

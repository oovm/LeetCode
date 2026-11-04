export class Solution {
    minPairSum(nums: number[]): number {
        const values = [...nums].sort((a, b) => a - b);
        let left = 0;
        let right = values.length - 1;
        let best = 0;
        while (left < right) {
            best = Math.max(best, values[left] + values[right]);
            left += 1;
            right -= 1;
        }
        return best;
    }
}

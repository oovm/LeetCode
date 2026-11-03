export class Solution {
    maxRotateFunction(nums: number[]): number {
        const n = nums.length;
        const sum = nums.reduce((a, b) => a + b, 0);
        let f = nums.reduce((acc, x, i) => acc + i * x, 0);
        let best = f;
        for (let k = 1; k < n; k++) {
            f += sum - n * nums[n - k];
            best = Math.max(best, f);
        }
        return best;
    }
}

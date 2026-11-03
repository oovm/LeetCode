export class Solution {
    minimumSum(n: number, k: number): number {
        const m = Math.min(Math.floor(k / 2), n);
        const rest = n - m;
        return (m * (m + 1)) / 2 + rest * k + (rest * (rest - 1)) / 2;
    }
}

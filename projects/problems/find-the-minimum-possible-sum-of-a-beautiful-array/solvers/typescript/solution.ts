export class Solution {
    minimumPossibleSum(n: number, target: number): number {
        const m = Math.min(Math.floor((target - 1) / 2), n);
        const rest = n - m;
        return (m * (m + 1)) / 2 + rest * target + (rest * (rest - 1)) / 2;
    }
}

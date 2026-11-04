export class Solution {
    missingNumber(arr: number[]): number {
        const n = arr.length;
        const sum = arr.reduce((a, b) => a + b, 0);
        return Math.floor(((arr[0] + arr[n - 1]) * (n + 1)) / 2) - sum;
    }
}

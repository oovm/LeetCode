export class Solution {
    findMinFibonacciNumbers(k: number): number {
        let a = 1;
        let b = 1;
        while (b <= k) {
            [a, b] = [b, a + b];
        }
        let ans = 0;
        while (k > 0) {
            if (k >= b) {
                k -= b;
                ans++;
            }
            [a, b] = [b - a, a];
        }
        return ans;
    }
}

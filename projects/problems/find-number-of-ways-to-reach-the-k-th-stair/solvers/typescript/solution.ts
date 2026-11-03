export class Solution {
    waysToReachStair(k: number): number {
        const choose = (n: number, r: number): number => {
            if (r < 0 || r > n) {
                return 0;
            }
            let result = 1;
            for (let i = 1; i <= r; i++) {
                result = (result * (n - i + 1)) / i;
            }
            return result;
        };
        let ways = 0;
        for (let j = 0, p = 1; p <= k + j + 1; j++, p *= 2) {
            ways += choose(j + 1, p - k);
        }
        return ways;
    }
}

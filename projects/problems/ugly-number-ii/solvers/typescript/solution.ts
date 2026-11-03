export class Solution {
    nthUglyNumber(n: number): number {
        const dp = new Array<number>(n).fill(1);
        let p2 = 0;
        let p3 = 0;
        let p5 = 0;
        for (let i = 1; i < n; i++) {
            dp[i] = Math.min((dp[p2] as number) * 2, (dp[p3] as number) * 3, (dp[p5] as number) * 5);
            if (dp[i] === (dp[p2] as number) * 2) p2++;
            if (dp[i] === (dp[p3] as number) * 3) p3++;
            if (dp[i] === (dp[p5] as number) * 5) p5++;
        }
        return dp[n - 1] as number;
    }
}

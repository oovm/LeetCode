export class Solution {
    countGoodStrings(low: number, high: number, zero: number, one: number): number {
        const MOD = 1000000007;
        const dp = new Array<number>(high + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= high; i++) {
            if (i >= zero) {
                dp[i] = (dp[i] as number) + (dp[i - zero] as number);
            }
            if (i >= one) {
                dp[i] = (dp[i] as number) + (dp[i - one] as number);
            }
            dp[i] = (dp[i] as number) % MOD;
        }
        let answer = 0;
        for (let i = low; i <= high; i++) {
            answer = (answer + (dp[i] as number)) % MOD;
        }
        return answer;
    }
}

export class Solution {
    goodBinaryStrings(minLength: number, maxLength: number, oneGroup: number, zeroGroup: number): number {
        const MOD = 1000000007;
        const dp = new Array<number>(maxLength + 1).fill(0);
        dp[0] = 1;
        for (let i = 1; i <= maxLength; i++) {
            if (i >= zeroGroup) {
                dp[i] = (dp[i] as number) + (dp[i - zeroGroup] as number);
            }
            if (i >= oneGroup) {
                dp[i] = (dp[i] as number) + (dp[i - oneGroup] as number);
            }
            dp[i] = (dp[i] as number) % MOD;
        }
        let answer = 0;
        for (let i = minLength; i <= maxLength; i++) {
            answer = (answer + (dp[i] as number)) % MOD;
        }
        return answer;
    }
}

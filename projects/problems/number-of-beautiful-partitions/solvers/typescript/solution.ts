export class Solution {
    beautifulPartitions(s: string, k: number, minLength: number): number {
        const MOD = 1000000007;
        const prime = new Set(['2', '3', '5', '7']);
        const n = s.length;
        if (!prime.has(s[0]) || prime.has(s[n - 1]) || k * minLength > n) {
            return 0;
        }
        const validStart = (j: number): boolean => j === 0 || (prime.has(s[j]) && !prime.has(s[j - 1]));
        const validEnd = (i: number): boolean => i === n || (!prime.has(s[i - 1]) && prime.has(s[i]));
        let dp = new Array<number>(n + 1).fill(0);
        dp[0] = 1;
        for (let part = 1; part <= k; part++) {
            const next = new Array<number>(n + 1).fill(0);
            let sum = 0;
            for (let i = part * minLength; i <= n; i++) {
                const j = i - minLength;
                if (validStart(j)) {
                    sum = (sum + dp[j]) % MOD;
                }
                if (validEnd(i)) {
                    next[i] = sum;
                }
            }
            dp = next;
        }
        return dp[n];
    }
}

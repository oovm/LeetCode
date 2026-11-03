export class Solution {
    numPermsDISequence(s: string): number {
        const MOD = 1000000007;
        const n = s.length;
        let dp = new Array<number>(n + 1).fill(1);
        for (const ch of s) {
            const next = new Array<number>(n).fill(0);
            if (ch === 'I') {
                let run = 0;
                for (let j = 0; j < n; j++) {
                    next[j] = run;
                    run = (run + dp[j]) % MOD;
                }
            } else {
                let run = 0;
                for (let j = n - 1; j >= 0; j--) {
                    next[j] = run;
                    run = (run + dp[j]) % MOD;
                }
            }
            dp = next;
        }
        return dp[0];
    }
}

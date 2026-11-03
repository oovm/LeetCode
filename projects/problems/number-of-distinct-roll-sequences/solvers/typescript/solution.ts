export class Solution {
    distinctSequences(n: number): number {
        const MOD = 1000000007;
        const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
        let dp: number[][] = Array.from({ length: 7 }, () => new Array<number>(7).fill(0));
        for (let a = 1; a <= 6; a++) {
            dp[a][0] = 1;
        }
        for (let i = 1; i < n; i++) {
            const next: number[][] = Array.from({ length: 7 }, () => new Array<number>(7).fill(0));
            for (let a = 1; a <= 6; a++) {
                for (let b = 0; b <= 6; b++) {
                    if (dp[a][b] === 0) continue;
                    for (let c = 1; c <= 6; c++) {
                        if (c !== a && c !== b && gcd(a, c) === 1) {
                            next[c][a] = (next[c][a] + dp[a][b]) % MOD;
                        }
                    }
                }
            }
            dp = next;
        }
        let total = 0;
        for (let a = 1; a <= 6; a++) {
            for (let b = 0; b <= 6; b++) {
                total = (total + dp[a][b]) % MOD;
            }
        }
        return total;
    }
}

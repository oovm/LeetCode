export class Solution {
    minimumChanges(s: string, k: number): number {
        const n = s.length;
        const cost = (l: number, r: number): number => {
            let c = 0;
            for (let i = l, j = r; i < j; i++, j--) {
                if (s[i] !== s[j]) c += 1;
            }
            return c;
        };
        const segCost: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(Infinity));
        for (let len = 1; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                const j = i + len - 1;
                const divisors: number[] = [];
                for (let d = 1; d < len; d++) {
                    if (len % d === 0) divisors.push(d);
                }
                let best = Infinity;
                for (const d of divisors) {
                    let c = 0;
                    for (let r0 = 0; r0 < d; r0++) {
                        const chars: string[] = [];
                        for (let p = i + r0; p <= j; p += d) chars.push(s[p]);
                        for (let a = 0, b = chars.length - 1; a < b; a++, b--) {
                            if (chars[a] !== chars[b]) c += 1;
                        }
                    }
                    best = Math.min(best, c);
                }
                segCost[i][j] = best;
            }
        }
        const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(k + 1).fill(Infinity));
        dp[0][0] = 0;
        for (let i = 1; i <= n; i++) {
            for (let p = 1; p <= Math.min(i, k); p++) {
                for (let j0 = 2 * (p - 1); j0 < i - 1; j0++) {
                    dp[i][p] = Math.min(dp[i][p], dp[j0][p - 1] + segCost[j0][i - 1]);
                }
            }
        }
        return dp[n][k];
    }
}

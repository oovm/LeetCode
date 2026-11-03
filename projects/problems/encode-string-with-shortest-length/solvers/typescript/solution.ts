export class Solution {
    encode(s: string): string {
        const n = s.length;
        const dp: string[][] = Array.from({ length: n }, () => new Array<string>(n).fill(''));
        for (let len = 1; len <= n; len++) {
            for (let i = 0; i + len <= n; i++) {
                const j = i + len - 1;
                const sub = s.slice(i, j + 1);
                dp[i][j] = sub;
                if (len >= 5) {
                    const doubled = (sub + sub).indexOf(sub, 1);
                    if (doubled < len) {
                        const count = len / doubled;
                        const inner = dp[i][i + doubled - 1];
                        const candidate = `${count}[${inner}]`;
                        if (candidate.length < dp[i][j].length) {
                            dp[i][j] = candidate;
                        }
                    }
                    for (let k = i; k < j; k++) {
                        const joined = dp[i][k] + dp[k + 1][j];
                        if (joined.length < dp[i][j].length) {
                            dp[i][j] = joined;
                        }
                    }
                }
            }
        }
        return dp[0][n - 1];
    }
}

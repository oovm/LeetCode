export class Solution {
    findPaths(m: number, n: number, maxMove: number, startRow: number, startColumn: number): number {
        const MOD = 1000000007;
        let dp = Array.from({ length: m }, () => new Array<number>(n).fill(0));
        dp[startRow]![startColumn] = 1;
        let answer = 0;
        for (let move = 0; move < maxMove; move++) {
            const next = Array.from({ length: m }, () => new Array<number>(n).fill(0));
            for (let i = 0; i < m; i++) {
                for (let j = 0; j < n; j++) {
                    const current = dp[i]![j] as number;
                    if (current === 0) {
                        continue;
                    }
                    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
                        const ni = i + di;
                        const nj = j + dj;
                        if (ni < 0 || ni >= m || nj < 0 || nj >= n) {
                            answer = (answer + current) % MOD;
                        } else {
                            next[ni]![nj] = ((next[ni]![nj] as number) + current) % MOD;
                        }
                    }
                }
            }
            dp = next;
        }
        return answer;
    }
}

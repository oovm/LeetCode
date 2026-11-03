export class Solution {
    knightProbability(row: number, k: number, n: number, column: number): number {
        const moves = [
            [-2, -1],
            [-2, 1],
            [-1, -2],
            [-1, 2],
            [1, -2],
            [1, 2],
            [2, -1],
            [2, 1],
        ];
        let dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
        dp[row][column] = 1;
        for (let step = 0; step < k; step++) {
            const next: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
            for (let r = 0; r < n; r++) {
                for (let c = 0; c < n; c++) {
                    if (dp[r][c] === 0) continue;
                    for (const [dr, dc] of moves) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
                            next[nr][nc] += dp[r][c] / 8;
                        }
                    }
                }
            }
            dp = next;
        }
        return dp.flat().reduce((a, b) => a + b, 0);
    }
}

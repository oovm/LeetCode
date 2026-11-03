export class Solution {
    minimumWhiteTiles(floor: string, carpetLen: number, numCarpets: number): number {
        const n = floor.length;
        const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(numCarpets + 1).fill(0));
        for (let i = 1; i <= n; i++) {
            const isWhite = floor[i - 1] === '1' ? 1 : 0;
            for (let c = 0; c <= numCarpets; c++) {
                dp[i][c] = dp[i - 1][c] + isWhite;
                if (c > 0) {
                    dp[i][c] = Math.min(dp[i][c], dp[Math.max(0, i - carpetLen)][c - 1]);
                }
            }
        }
        return dp[n][numCarpets];
    }
}

export class Solution {
    winnerSquareGame(n: number): boolean {
        const win = new Array<boolean>(n + 1).fill(false);
        for (let i = 1; i <= n; i++) {
            for (let sq = 1; sq * sq <= i; sq++) {
                if (!win[i - sq * sq]) {
                    win[i] = true;
                    break;
                }
            }
        }
        return win[n];
    }
}

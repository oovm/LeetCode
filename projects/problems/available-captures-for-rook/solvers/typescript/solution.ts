export class Solution {
    numRookCaptures(board: string[][]): number {
        let ri = -1;
        let rj = -1;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (board[i][j] === "R") {
                    ri = i;
                    rj = j;
                }
            }
        }
        let captures = 0;
        for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
            let i = ri + di;
            let j = rj + dj;
            while (i >= 0 && i < 8 && j >= 0 && j < 8) {
                if (board[i][j] === "B") break;
                if (board[i][j] === "p") {
                    captures++;
                    break;
                }
                i += di;
                j += dj;
            }
        }
        return captures;
    }
}

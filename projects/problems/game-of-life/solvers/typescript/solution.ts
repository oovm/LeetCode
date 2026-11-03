export class Solution {
    gameOfLife(board: number[][]): void {
        const m = board.length;
        const n = board[0].length;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                let live = 0;
                for (const [di, dj] of [
                    [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
                ]) {
                    const ni = i + di;
                    const nj = j + dj;
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] % 2 === 1) live++;
                }
                if (board[i][j] === 1 && (live < 2 || live > 3)) board[i][j] = 3;
                if (board[i][j] === 0 && live === 3) board[i][j] = 2;
            }
        }
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (board[i][j] === 2) board[i][j] = 1;
                else if (board[i][j] === 3) board[i][j] = 0;
            }
        }
    }
}

export class Solution {
    solve(board: string[][]): void {
        const m = board.length;
        const n = board[0].length;
        const mark = (i: number, j: number) => {
            if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== "O") return;
            board[i][j] = "S";
            mark(i + 1, j);
            mark(i - 1, j);
            mark(i, j + 1);
            mark(i, j - 1);
        };
        for (let i = 0; i < m; i++) {
            mark(i, 0);
            mark(i, n - 1);
        }
        for (let j = 0; j < n; j++) {
            mark(0, j);
            mark(m - 1, j);
        }
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                board[i][j] = board[i][j] === "S" ? "O" : "X";
            }
        }
    }
}

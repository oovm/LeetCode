export class Solution {
    updateBoard(board: string[][], click: number[]): string[][] {
        const m = board.length;
        const n = board[0].length;
        const [ci, cj] = click;
        if (board[ci][cj] === "M") {
            board[ci][cj] = "X";
            return board;
        }
        const reveal = (i: number, j: number) => {
            if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== "E") return;
            let mines = 0;
            for (const [di, dj] of [
                [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
            ]) {
                const ni = i + di;
                const nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] === "M") mines++;
            }
            if (mines > 0) {
                board[i][j] = String(mines);
                return;
            }
            board[i][j] = "B";
            for (const [di, dj] of [
                [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1],
            ]) {
                reveal(i + di, j + dj);
            }
        };
        reveal(ci, cj);
        return board;
    }
}

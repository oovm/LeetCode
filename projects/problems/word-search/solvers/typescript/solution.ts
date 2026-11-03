export class Solution {
    exist(board: string[][], word: string): boolean {
        const m = board.length;
        const n = board[0].length;
        const dfs = (i: number, j: number, k: number): boolean => {
            if (k === word.length) return true;
            if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
            board[i][j] = "#";
            const found =
                dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
            board[i][j] = word[k];
            return found;
        };
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (dfs(i, j, 0)) return true;
            }
        }
        return false;
    }
}

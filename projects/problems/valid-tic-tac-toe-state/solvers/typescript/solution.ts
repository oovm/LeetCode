export class Solution {
    validTicTacToe(board: string[]): boolean {
        const x = board.join('').split('X').length - 1;
        const o = board.join('').split('O').length - 1;
        if (x !== o && x - 1 !== o) {
            return false;
        }
        if (this.wins(board, 'X') && x - 1 !== o) {
            return false;
        }
        return !(this.wins(board, 'O') && x !== o);
    }

    private wins(board: string[], mark: string): boolean {
        for (let line = 0; line < 3; line++) {
            if (board[line][0] === mark && board[line][1] === mark && board[line][2] === mark) {
                return true;
            }
            if (board[0][line] === mark && board[1][line] === mark && board[2][line] === mark) {
                return true;
            }
        }
        if (board[0][0] === mark && board[1][1] === mark && board[2][2] === mark) {
            return true;
        }
        return board[0][2] === mark && board[1][1] === mark && board[2][0] === mark;
    }
}

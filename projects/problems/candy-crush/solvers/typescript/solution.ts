export class Solution {
    candyCrush(board: number[][]): number[][] {
        const rows = board.length;
        if (rows === 0) {
            return board;
        }
        const columns = board[0].length;
        const crushOnce = (): boolean => {
            const marked: boolean[][] = Array.from({ length: rows }, () => new Array<boolean>(columns).fill(false));
            for (let row = 0; row < rows; row++) {
                let start = 0;
                while (start < columns) {
                    let stop = start + 1;
                    while (stop < columns && board[row][stop] === board[row][start]) {
                        stop++;
                    }
                    if (board[row][start] !== 0 && stop - start >= 3) {
                        for (let at = start; at < stop; at++) {
                            marked[row][at] = true;
                        }
                    }
                    start = stop;
                }
            }
            for (let column = 0; column < columns; column++) {
                let start = 0;
                while (start < rows) {
                    let stop = start + 1;
                    while (stop < rows && board[stop][column] === board[start][column]) {
                        stop++;
                    }
                    if (board[start][column] !== 0 && stop - start >= 3) {
                        for (let at = start; at < stop; at++) {
                            marked[at][column] = true;
                        }
                    }
                    start = stop;
                }
            }
            let changed = false;
            for (let row = 0; row < rows; row++) {
                for (let column = 0; column < columns; column++) {
                    if (marked[row][column]) {
                        if (board[row][column] !== 0) {
                            changed = true;
                        }
                        board[row][column] = 0;
                    }
                }
            }
            if (!changed) {
                return false;
            }
            for (let column = 0; column < columns; column++) {
                let top = rows;
                for (let row = rows - 1; row >= 0; row--) {
                    if (board[row][column] !== 0) {
                        top--;
                        board[top][column] = board[row][column];
                    }
                }
                for (let row = top - 1; row >= 0; row--) {
                    board[row][column] = 0;
                }
            }
            return true;
        };
        while (crushOnce()) {
            // 反复消除直到版面稳定
        }
        return board;
    }
}

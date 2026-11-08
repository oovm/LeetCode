namespace probe.backtracking_in_place;

using std.collection

# N 皇后：棋盘直接在原地标记与撤销，递归返回解的个数。
structure Chessboard {
    squares: ArrayList<i64>
    size: i64
}

micro board_new(size: i64) -> Chessboard {
    let mut squares: ArrayList<i64> = ArrayList::new((size * size) as usize)
    let mut index: i64 = 0
    while index < size * size {
        squares.push(0)
        index = index + 1
    }
    return Chessboard { squares: squares, size: size }
}

micro attacks(board: Chessboard, row: i64, column: i64) -> bool {
    let mut scan: i64 = 0
    while scan < board.size {
        if board.squares⁅(scan * board.size + column) as usize⁆ != 0 {
            return true
        }
        let left_column: i64 = column - row + scan
        if left_column >= 0 && left_column < board.size {
            if board.squares⁅(scan * board.size + left_column) as usize⁆ != 0 {
                return true
            }
        }
        let right_column: i64 = column + row - scan
        if right_column >= 0 && right_column < board.size {
            if board.squares⁅(scan * board.size + right_column) as usize⁆ != 0 {
                return true
            }
        }
        scan = scan + 1
    }
    return false
}

# 放置后递归下一行，返回前把格子改回 0，保证原地状态可复用。
micro solve(mut board: Chessboard, row: i64) -> i64 {
    if row == board.size {
        return 1
    }
    let mut total: i64 = 0
    let mut column: i64 = 0
    while column < board.size {
        if !attacks(board, row, column) {
            board.squares.set_cardinal((row * board.size + column) as usize, 1)
            total = total + solve(board, row + 1)
            board.squares.set_cardinal((row * board.size + column) as usize, 0)
        }
        column = column + 1
    }
    return total
}

[export(name: "nQueensCount")]
micro n_queens_count() -> i64 {
    let mut board: Chessboard = board_new(8)
    return solve(board, 0)
}

[export(name: "nQueensSmallCount")]
micro n_queens_small_count() -> i64 {
    let mut board: Chessboard = board_new(6)
    return solve(board, 0)
}

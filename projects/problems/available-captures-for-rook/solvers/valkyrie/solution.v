namespace leetcode.available_captures_for_rook;

using std.collection;

# 找到车的位置后四向扫描：先遇兵计 1，先遇象或出界不计。
micro scan_up(board: ArrayList<ArrayList<utf8>>, row: usize, column: usize) -> i64 {
    let mut cursor: usize = row
    while cursor > 0 {
        cursor = cursor - 1
        let cell: utf8 = board⁅cursor⁆⁅column⁆
        if cell == "B" {
            cursor = 0
        }
        if cell == "p" {
            return 1
        }
    }
    return 0
}

micro scan_down(board: ArrayList<ArrayList<utf8>>, row: usize, column: usize) -> i64 {
    let mut cursor: usize = row
    while cursor + 1 < 8 {
        cursor = cursor + 1
        let cell: utf8 = board⁅cursor⁆⁅column⁆
        if cell == "B" {
            cursor = 7
        }
        if cell == "p" {
            return 1
        }
    }
    return 0
}

micro scan_left(board: ArrayList<ArrayList<utf8>>, row: usize, column: usize) -> i64 {
    let mut cursor: usize = column
    while cursor > 0 {
        cursor = cursor - 1
        let cell: utf8 = board⁅row⁆⁅cursor⁆
        if cell == "B" {
            cursor = 0
        }
        if cell == "p" {
            return 1
        }
    }
    return 0
}

micro scan_right(board: ArrayList<ArrayList<utf8>>, row: usize, column: usize) -> i64 {
    let mut cursor: usize = column
    while cursor + 1 < 8 {
        cursor = cursor + 1
        let cell: utf8 = board⁅row⁆⁅cursor⁆
        if cell == "B" {
            cursor = 7
        }
        if cell == "p" {
            return 1
        }
    }
    return 0
}

[export(case: "camelCase")]
micro numRookCaptures(board: ArrayList<ArrayList<utf8>>) -> i64 {
    let mut rookRow: usize = 0
    let mut rookColumn: usize = 0
    let mut row: usize = 0
    while row < 8 {
        let mut column: usize = 0
        while column < 8 {
            if board⁅row⁆⁅column⁆ == "R" {
                rookRow = row
                rookColumn = column
            }
            column = column + 1
        }
        row = row + 1
    }
    let captures: i64 = scan_up(board, rookRow, rookColumn)
        + scan_down(board, rookRow, rookColumn)
        + scan_left(board, rookRow, rookColumn)
        + scan_right(board, rookRow, rookColumn)
    return captures
}

class Solution {
    micro numRookCaptures(self, board: ArrayList<ArrayList<utf8>>): i64 {
        return numRookCaptures(board)
    }
}

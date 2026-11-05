namespace leetcode.valid_tic_tac_toe_state;

using std.collection;

micro wins(board: ArrayList<utf8>, mark: i64) -> bool {
    let mut line: usize = 0
    while line < 3 {
        if (board⁅line⁆.byte_at(0) as i64) == mark && (board⁅line⁆.byte_at(1) as i64) == mark && (board⁅line⁆.byte_at(2) as i64) == mark {
            return true
        }
        if (board⁅0⁆.byte_at(line) as i64) == mark && (board⁅1⁆.byte_at(line) as i64) == mark && (board⁅2⁆.byte_at(line) as i64) == mark {
            return true
        }
        line = line + 1
    }
    if (board⁅0⁆.byte_at(0) as i64) == mark && (board⁅1⁆.byte_at(1) as i64) == mark && (board⁅2⁆.byte_at(2) as i64) == mark {
        return true
    }
    return (board⁅0⁆.byte_at(2) as i64) == mark && (board⁅1⁆.byte_at(1) as i64) == mark && (board⁅2⁆.byte_at(0) as i64) == mark
}

# 计数与胜局一致性：X 先手，所以 `x == o` 或 `x == o + 1`。
# 若 X 已成三连，则最后一手必须是 X，即 `x == o + 1`；若 O 已成三连，则 X 不能多下，即 `x == o`。
[export(case: "camelCase")]
micro valid_tic_tac_toe(board: ArrayList<utf8>) -> bool {
    let mut xs: i64 = 0
    let mut os: i64 = 0
    let mut row: usize = 0
    while row < 3 {
        let mut col: usize = 0
        while col < 3 {
            let code: i64 = board⁅row⁆.byte_at(col) as i64
            if code == 88 {
                xs = xs + 1
            }
            if code == 79 {
                os = os + 1
            }
            col = col + 1
        }
        row = row + 1
    }
    if xs != os && xs - 1 != os {
        return false
    }
    if wins(board, 88) && xs - 1 != os {
        return false
    }
    return !(wins(board, 79) && xs != os)
}

class Solution {
    micro validTicTacToe(self, board: ArrayList<utf8>): bool {
        return valid_tic_tac_toe(board)
    }
}

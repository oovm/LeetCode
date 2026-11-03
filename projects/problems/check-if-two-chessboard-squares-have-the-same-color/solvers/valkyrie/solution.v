namespace leetcode.check_if_two_chessboard_squares_have_the_same_color;

micro square_parity(coordinate: utf8) -> i64 {
    let zero: usize = 0
    let one: usize = 1
    let column: u32 = coordinate⁅zero⁆ as u32
    let row: u32 = coordinate⁅one⁆ as u32
    return ((column + row) % 2) as i64
}

# 棋盘格色由列号与行号之和的奇偶决定。
[export(case: "camelCase")]
micro check_two_chessboards(coordinate1: utf8, coordinate2: utf8) -> bool {
    return square_parity(coordinate1) == square_parity(coordinate2)
}

class Solution {
    micro checkTwoChessboards(self, coordinate1: utf8, coordinate2: utf8): bool {
        return check_two_chessboards(coordinate1, coordinate2)
    }
}

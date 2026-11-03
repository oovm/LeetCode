namespace leetcode.determine_color_of_a_chessboard_square;

[export(case: "camelCase")]
micro square_is_white(coordinates: utf8) -> bool {
    let col: i64 = coordinates⁅0⁆ as u32 as i64 - 97
    let row: i64 = coordinates⁅1⁆ as u32 as i64 - 49
    return (col + row) % 2 == 1
}

class Solution {
    micro squareIsWhite(self, coordinates: utf8): bool {
        return square_is_white(coordinates)
    }
}

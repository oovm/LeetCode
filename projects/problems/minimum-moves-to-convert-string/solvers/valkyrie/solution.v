namespace leetcode.minimum_moves_to_convert_string;

[export(case: "camelCase")]
micro minimum_moves(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut moves: i64 = 0
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32 as i64) == 88 {
            moves = moves + 1
            i = i + 3
        } else {
            i = i + 1
        }
    }
    return moves
}

class Solution {
    micro minimumMoves(self, s: utf8): i64 {
        return minimum_moves(s)
    }
}

namespace leetcode.find_winner_on_a_tic_tac_toe_game;

using std.collection;

# 双方各压成 9 位掩码，对 8 条 winning 线判子集；未满盘且无人胜则 Pending。
micro line_hit(mask: i64, a: i64, b: i64, c: i64) -> bool {
    let bits: i64 = (1 as i64).bit_shift_left(a)
        .bit_or((1 as i64).bit_shift_left(b))
        .bit_or((1 as i64).bit_shift_left(c))
    return mask.bit_and(bits) == bits
}

micro player_won(mask: i64) -> bool {
    return line_hit(mask, 0, 1, 2)
        || line_hit(mask, 3, 4, 5)
        || line_hit(mask, 6, 7, 8)
        || line_hit(mask, 0, 3, 6)
        || line_hit(mask, 1, 4, 7)
        || line_hit(mask, 2, 5, 8)
        || line_hit(mask, 0, 4, 8)
        || line_hit(mask, 2, 4, 6)
}

[export(case: "camelCase")]
micro tictactoe(moves: ArrayList<ArrayList<i64>>) -> utf8 {
    let mut maskA: i64 = 0
    let mut maskB: i64 = 0
    let mut index: usize = 0
    while index < moves.length() {
        let cell: i64 = moves⁅index⁆⁅0⁆ * 3 + moves⁅index⁆⁅1⁆
        let bit: i64 = (1 as i64).bit_shift_left(cell)
        if index % 2 == 0 {
            maskA = maskA.bit_or(bit)
        } else {
            maskB = maskB.bit_or(bit)
        }
        index = index + 1
    }
    if player_won(maskA) {
        return "A"
    }
    if player_won(maskB) {
        return "B"
    }
    if moves.length() == 9 {
        return "Draw"
    }
    return "Pending"
}

class Solution {
    micro tictactoe(self, moves: ArrayList<ArrayList<i64>>): utf8 {
        return tictactoe(moves)
    }
}

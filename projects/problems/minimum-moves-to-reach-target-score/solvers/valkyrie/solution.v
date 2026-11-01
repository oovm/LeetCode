namespace leetcode.minimum_moves_to_reach_target_score;

[export(case: "camelCase")]
micro min_moves(target: i64, maxDoubles: i64) -> i64 {
    let mut value: i64 = target
    let mut doubles: i64 = maxDoubles
    let mut moves: i64 = 0
    while value > 1 {
        if doubles > 0 {
            if value % 2 == 0 {
                value = value / 2
                doubles = doubles - 1
            } else {
                value = value - 1
            }
            moves = moves + 1
        } else {
            moves = moves + value - 1
            value = 1
        }
    }
    return moves
}

class Solution {
    micro minMoves(self, target: i64, maxDoubles: i64): i64 {
        return min_moves(target, maxDoubles)
    }
}

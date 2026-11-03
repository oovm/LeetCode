namespace leetcode.furthest_point_from_origin;

[export(case: "camelCase")]
micro furthest_distance_from_origin(moves: utf8) -> i64 {
    let n: usize = moves.length()
    let mut left_steps: i64 = 0
    let mut right_steps: i64 = 0
    let mut blanks: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: u32 = moves⁅i⁆ as u32
        if code == 76 {
            left_steps = left_steps + 1
        } else if code == 82 {
            right_steps = right_steps + 1
        } else {
            blanks = blanks + 1
        }
        i = i + 1
    }
    let mut balance: i64 = right_steps - left_steps
    if balance < 0 {
        balance = -balance
    }
    return balance + blanks
}

class Solution {
    micro furthestDistanceFromOrigin(self, moves: utf8): i64 {
        return furthest_distance_from_origin(moves)
    }
}

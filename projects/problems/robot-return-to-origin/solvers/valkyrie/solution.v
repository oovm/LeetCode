namespace leetcode.robot_return_to_origin;

# 累计位移后回到原点，O(n)
[export(case: "camelCase")]
micro judge_circle(moves: utf8) -> bool {
    let mut x: i64 = 0
    let mut y: i64 = 0
    let mut i: usize = 0
    while i < moves.length() {
        let code: u32 = moves⁅i⁆ as u32
        if code == 85 {
            y = y + 1
        } else if code == 68 {
            y = y - 1
        } else if code == 76 {
            x = x - 1
        } else if code == 82 {
            x = x + 1
        }
        i = i + 1
    }
    return x == 0 && y == 0
}

class Solution {
    micro judgeCircle(self, moves: utf8): bool {
        return judge_circle(moves)
    }
}

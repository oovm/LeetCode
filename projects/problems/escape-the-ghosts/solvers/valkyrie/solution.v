namespace leetcode.escape_the_ghosts;

using std.collection;

# 你只能向远离目标的四个方向之一移动，所以幽灵只要在曼哈顿距离上不慢于你，
# 就一定能截住你；全部更远才能逃脱。O(幽灵数)。
micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

[export(case: "camelCase")]
micro can_escape(ghosts: ArrayList<ArrayList<i64>>, target: ArrayList<i64>) -> bool {
    let goal: i64 = absolute(target⁅0⁆) + absolute(target⁅1⁆)
    let mut index: usize = 0
    while index < ghosts.length() {
        let ghost: ArrayList<i64> = ghosts⁅index⁆
        let reach: i64 = absolute(ghost⁅0⁆) + absolute(ghost⁅1⁆)
        if reach <= goal {
            return false
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro canEscape(self, ghosts: ArrayList<ArrayList<i64>>, target: ArrayList<i64>): bool {
        return can_escape(ghosts, target)
    }
}

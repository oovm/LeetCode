namespace leetcode.jump_game_ii;

# 按跳跃层数推进：当前层走到边界时步数加一。
[export(case: "camelCase")]
micro jump(nums: [i64]) -> i64 {
    let n: usize = nums.length()
    let mut jumps: i64 = 0
    let mut end: i64 = 0
    let mut farthest: i64 = 0
    let mut i: usize = 0
    while (i as i64) + 1 < (n as i64) {
        let reach: i64 = (i as i64) + nums⁅i⁆
        if reach > farthest {
            farthest = reach
        }
        if i as i64 == end {
            jumps = jumps + 1
            end = farthest
        }
        i = i + 1
    }
    return jumps
}

class Solution {
    micro jump(self, nums: [i64]): i64 {
        return jump(nums)
    }
}

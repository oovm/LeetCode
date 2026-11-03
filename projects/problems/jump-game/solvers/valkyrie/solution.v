namespace leetcode.jump_game;

# 贪心维护可达最远下标。
[export(case: "camelCase")]
micro can_jump(nums: ArrayList<i64>) -> bool {
    let n: usize = nums.length()
    let mut farthest: i64 = 0
    let mut i: usize = 0
    while i < n && (i as i64) <= farthest {
        let reach: i64 = (i as i64) + nums⁅i⁆.unwrap()
        if reach > farthest {
            farthest = reach
        }
        i = i + 1
    }
    return farthest >= (n as i64) - 1
}

class Solution {
    micro canJump(self, nums: ArrayList<i64>): bool {
        return can_jump(nums)
    }
}

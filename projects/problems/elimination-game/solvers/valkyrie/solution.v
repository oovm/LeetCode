namespace leetcode.elimination_game;

# 头跟踪：每轮剩余减半，从左扫或剩余为奇数时头右移 step，step 翻倍。
[export(case: "camelCase")]
micro last_remaining(n: i64) -> i64 {
    let mut head: i64 = 1
    let mut step: i64 = 1
    let mut remaining: i64 = n
    let mut left_to_right: bool = true
    while remaining > 1 {
        if left_to_right || remaining % 2 == 1 {
            head = head + step
        }
        step = step * 2
        remaining = remaining / 2
        left_to_right = !left_to_right
    }
    return head
}

class Solution {
    micro lastRemaining(self, n: i64): i64 {
        return last_remaining(n)
    }
}

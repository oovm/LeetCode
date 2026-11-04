namespace leetcode.verify_preorder_sequence_in_binary_search_tree;

using std.collection;

# 单调栈：栈里是「尚未被弹出」的下降路径，弹出时更新下界。
# 本题压 `Deque` 第二面（`push_back` / `peek_back` / `pop_back` 单端使用），
# `Deque::new()` 无容量参数与 G12 同族，但规模已由 `preorder.length()` 给出，先按现状写。
[export(case: "camelCase")]
micro verify_preorder(preorder: [i64]) -> bool {
    let mut stack: Deque<i64> = Deque::new()
    let mut low: i64 = -9223372036854775807

    let mut i: usize = 0
    while i < preorder.length() {
        let value: i64 = preorder⁅i⁆
        if value < low {
            return false
        }

        let mut settled: bool = false
        while !stack.is_empty() && !settled {
            let top: i64 = stack.peek_back().unwrap()
            if value > top {
                low = stack.pop_back().unwrap()
            } else {
                settled = true
            }
        }
        stack.push_back(value)
        i = i + 1
    }
    return true
}

class Solution {
    micro verifyPreorder(self, preorder: [i64]): bool {
        return verify_preorder(preorder)
    }
}

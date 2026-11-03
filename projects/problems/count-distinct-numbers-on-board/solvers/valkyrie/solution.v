namespace leetcode.count_distinct_numbers_on_board;

# 收敛事实：每天只会把「比现有最小值小 1 的数」补上，最终棋盘是 2..n，共 n - 1 个；n == 1 时只有 1。
[export(case: "camelCase")]
micro distinct_integers(n: i64) -> i64 {
    if n == 1 {
        return 1
    }
    return n - 1
}

class Solution {
    micro distinctIntegers(self, n: i64): i64 {
        return distinct_integers(n)
    }
}

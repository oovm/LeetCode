namespace leetcode.remove_9;

# 第 n 个无 9 整数 = n 的九进制表示逐位照旧读出。
[export(case: "camelCase")]
micro new_integer(n: i64) -> i64 {
    let mut result: i64 = 0
    let mut place: i64 = 1
    let mut rest: i64 = n
    while rest > 0 {
        result = result + rest % 9 * place
        place = place * 10
        rest = rest / 9
    }
    return result
}

class Solution {
    micro newInteger(self, n: i64): i64 {
        return new_integer(n)
    }
}

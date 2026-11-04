namespace leetcode.solution

using std.collection

# 题内触发点: 仅用现有递归 + `utf8` 拼接；不依赖自定义记录排序，也不碰 G25 / G26 / G27。
micro expand(open: i64, close: i64, limit: i64, current: utf8, results: ArrayList<utf8>) -> unit {
    if current.length() == (2 * limit) as usize {
        results.push(current)
        return
    }
    if open < limit {
        expand(open + 1, close, limit, current + "(", results)
    }
    if close < open {
        expand(open, close + 1, limit, current + ")", results)
    }
}

class Solution {
    [export(case: "generateParenthesis")]
    micro generateParenthesis(n: i64) -> ArrayList<utf8> {
        let mut results: ArrayList<utf8> = ArrayList::new(0)
        expand(0, 0, n, "", results)
        return results
    }
}

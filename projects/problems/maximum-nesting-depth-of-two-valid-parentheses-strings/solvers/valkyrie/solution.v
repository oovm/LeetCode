namespace leetcode.maximum_nesting_depth_of_two_valid_parentheses_strings;

using std.collection;

# 按当前嵌套深度交替分给两组，任一时刻两组深度差不超过 1 且各串合法。
[export(case: "camelCase")]
micro max_depth_after_split(seq: utf8) -> ArrayList<i64> {
    let size: usize = seq.length()
    let mut answer: ArrayList<i64> = ArrayList::new(size)
    loop _fill in 0..size {
        answer.push(0)
    }

    let mut depth: i64 = 0
    loop index in 0..size {
        if seq⁅index⁆ == '(' {
            answer⁅index⁆ = depth & 1
            depth = depth + 1
        } else {
            depth = depth - 1
            answer⁅index⁆ = depth & 1
        }
    }
    return answer
}

class Solution {
    micro maxDepthAfterSplit(self, seq: utf8): ArrayList<i64> {
        return max_depth_after_split(seq)
    }
}

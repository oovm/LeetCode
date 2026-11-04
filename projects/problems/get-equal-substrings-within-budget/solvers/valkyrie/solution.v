namespace leetcode.get_equal_substrings_within_budget;

# 滑窗维护当前花费：右端计入代价，超出预算时左端退出，取最长窗。
# 代价是两字符码位差的绝对值。
micro char_cost(a: char, b: char) -> i64 {
    let mut diff: i64 = a as i64 - b as i64
    if diff < 0 {
        diff = 0 - diff
    }
    return diff
}

[export(case: "camelCase")]
micro equalSubstring(s: utf8, t: utf8, maxCost: i64) -> i64 {
    let mut cost: i64 = 0
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < s.length() {
        cost = cost + char_cost(s⁅right⁆, t⁅right⁆)
        while cost > maxCost {
            cost = cost - char_cost(s⁅left⁆, t⁅left⁆)
            left = left + 1
        }
        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro equalSubstring(self, s: utf8, t: utf8, maxCost: i64): i64 {
        return equalSubstring(s, t, maxCost)
    }
}

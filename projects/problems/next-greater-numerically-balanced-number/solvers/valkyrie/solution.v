namespace leetcode.next_greater_numerically_balanced_number;

micro digit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        count = count + 1
        rest = rest / 10
    }
    return count
}

micro count_digit(x: i64, d: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        if rest % 10 == d {
            count = count + 1
        }
        rest = rest / 10
    }
    return count
}

# 数值平衡：每个数字 d 恰出现 d 次（0 不出现）。
micro is_balanced(x: i64) -> bool {
    if count_digit(x, 0) > 0 {
        return false
    }
    let mut d: i64 = 1
    while d <= 9 {
        let c: i64 = count_digit(x, d)
        if c != 0 && c != d {
            return false
        }
        d = d + 1
    }
    return true
}

[export(case: "camelCase")]
micro next_beautiful_number(n: i64) -> i64 {
    let mut x: i64 = n + 1
    while !is_balanced(x) {
        x = x + 1
    }
    return x
}

class Solution {
    micro nextBeautifulNumber(self, n: i64): i64 {
        return next_beautiful_number(n)
    }
}

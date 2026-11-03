namespace leetcode.minimum_addition_to_make_integer_beautiful;

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

micro digit_sum(x: i64) -> i64 {
    let mut sum: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        sum = sum + rest % 10
        rest = rest / 10
    }
    return sum
}

# 数字和超标就抹去末位并进一，记录抹去位数后补零减原值。
[export(case: "camelCase")]
micro make_integer_beautiful(n: i64, target: i64) -> i64 {
    let mut x: i64 = n
    let mut p: i64 = 0
    while digit_sum(x) > target {
        x = x / 10 + 1
        p = p + 1
    }
    return x * pow10(p) - n
}

class Solution {
    micro makeIntegerBeautiful(self, n: i64, target: i64): i64 {
        return make_integer_beautiful(n, target)
    }
}

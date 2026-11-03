namespace leetcode.reordered_power_of_2;

# 数字多重集比较：逐数字计数差为零 ⟺ 排列。预生成 2 的幂（≤ 10^9 共 30 个），位数相同者比对。
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

micro same_digits(a: i64, b: i64) -> bool {
    if digit_count(a) != digit_count(b) {
        return false
    }
    let mut d: i64 = 0
    while d <= 9 {
        if count_digit(a, d) != count_digit(b, d) {
            return false
        }
        d = d + 1
    }
    return true
}

[export(case: "camelCase")]
micro reordered_power_of_2(n: i64) -> bool {
    let mut power: i64 = 1
    while power <= 1000000000 {
        if same_digits(n, power) {
            return true
        }
        power = power * 2
    }
    return false
}

class Solution {
    micro reorderedPowerOf2(self, n: i64): bool {
        return reordered_power_of_2(n)
    }
}

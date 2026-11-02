namespace leetcode.nth_digit;

# 第 n 个数字所在的「位数区间」：len 位数共 9*10^(len-1) 个数、9*10^(len-1)*len 位。
# 逐区间扣减后定位到具体数与具体位（不转字符串，纯算术取位）。
[export(case: "camelCase")]
micro find_nth_digit(n: i64) -> i64 {
    let mut remaining: i64 = n
    let mut len: i64 = 1
    let mut count: i64 = 9
    let mut start: i64 = 1
    while remaining > len * count {
        remaining = remaining - len * count
        len = len + 1
        count = count * 10
        start = start * 10
    }
    let number: i64 = start + (remaining - 1) / len
    let digit_index: i64 = (remaining - 1) % len
    # digit_index 从左数第几位（0 起），换算成除以 10 的幂取位。
    let mut shift: i64 = len - 1 - digit_index
    let mut value: i64 = number
    while shift > 0 {
        value = value / 10
        shift = shift - 1
    }
    return value % 10
}

class Solution {
    micro findNthDigit(self, n: i64): i64 {
        return find_nth_digit(n)
    }
}

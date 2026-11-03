namespace leetcode.digit_count_in_range;

# ≤ n 的数字中 d 出现次数（逐位权公式；d=0 扣除前导零贡献）。
micro count_digit_le(n: i64, d: i64) -> i64 {
    if n < 1 {
        return 0
    }
    let mut total: i64 = 0
    let mut w: i64 = 1
    while w <= n {
        let high: i64 = n / (w * 10)
        let cur: i64 = n / w % 10
        let low: i64 = n % w
        if d == 0 {
            if high > 0 {
                if cur == 0 {
                    total = total + (high - 1) * w + low + 1
                } else {
                    total = total + (high - 1) * w + w
                }
            }
        } else {
            if cur > d {
                total = total + (high + 1) * w
            } else if cur == d {
                total = total + high * w + low + 1
            } else {
                total = total + high * w
            }
        }
        w = w * 10
    }
    return total
}

[export(case: "camelCase")]
micro digits_count(d: i64, low: i64, high: i64) -> i64 {
    return count_digit_le(high, d) - count_digit_le(low - 1, d)
}

class Solution {
    micro digitsCount(self, d: i64, low: i64, high: i64): i64 {
        return digits_count(d, low, high)
    }
}

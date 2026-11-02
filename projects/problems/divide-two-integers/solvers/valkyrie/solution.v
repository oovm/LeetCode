namespace leetcode.divide_two_integers;

[export(case: "camelCase")]
micro divide(dividend: i64, divisor: i64) -> i64 {
    if dividend == -2147483648 && divisor == -1 {
        return 2147483647
    }
    let negative: bool = (dividend < 0) != (divisor < 0)
    let mut a: i64 = dividend
    if a < 0 {
        a = -a
    }
    let mut b: i64 = divisor
    if b < 0 {
        b = -b
    }
    let mut result: i64 = 0
    while a >= b {
        let mut temp: i64 = b
        let mut multiple: i64 = 1
        while a >= temp + temp {
            temp = temp + temp
            multiple = multiple + multiple
        }
        a = a - temp
        result = result + multiple
    }
    if negative {
        return -result
    }
    return result
}

class Solution {
    micro divide(self, dividend: i64, divisor: i64): i64 {
        return divide(dividend, divisor)
    }
}

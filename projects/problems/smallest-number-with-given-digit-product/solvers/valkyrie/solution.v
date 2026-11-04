namespace leetcode.smallest_number_with_given_digit_product;

# 因子从 9 降到 2 逐次除运行余数，按低位到高位拼数即最小；无解或超 i64 返回 -1。
[export(case: "camelCase")]
micro smallest_number(n: i64) -> i64 {
    if n < 10 {
        if n == 0 {
            return 0
        }
        return n
    }
    let mut rest: i64 = n
    let mut answer: i64 = 0
    let mut place: i64 = 1
    let mut digits: i64 = 0
    let mut d: i64 = 9
    while d >= 2 {
        while rest % d == 0 {
            if digits >= 19 {
                return -1
            }
            let add: i64 = d * place
            if digits == 18 && answer > 9223372036854775807 - add {
                return -1
            }
            answer = answer + add
            digits = digits + 1
            rest = rest / d
            if digits < 19 {
                place = place * 10
            }
        }
        d = d - 1
    }
    if rest > 1 {
        return -1
    }
    return answer
}

class Solution {
    micro smallestNumber(self, n: i64): i64 {
        return smallest_number(n)
    }
}

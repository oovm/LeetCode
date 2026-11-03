namespace leetcode.smallest_number_with_given_digit_product;

micro count_factor(n: i64, d: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = n
    while rest % d == 0 {
        count = count + 1
        rest = rest / d
    }
    return count
}

micro stripped(n: i64) -> i64 {
    let mut rest: i64 = n
    let mut d: i64 = 9
    while d >= 2 {
        while rest % d == 0 {
            rest = rest / d
        }
        d = d - 1
    }
    return rest
}

# 因子拆 9..2，数字升序重建最小；余 >1 即不可表示返回 0。
[export(case: "camelCase")]
micro smallest_number(n: i64) -> i64 {
    if n < 10 {
        if n == 0 {
            return 0
        }
        return n
    }
    if stripped(n) > 1 {
        return 0
    }
    let mut answer: i64 = 0
    let mut d: i64 = 2
    while d <= 9 {
        let mut c: i64 = count_factor(n, d)
        while c > 0 {
            answer = answer * 10 + d
            c = c - 1
        }
        d = d + 1
    }
    return answer
}

class Solution {
    micro smallestNumber(self, n: i64): i64 {
        return smallest_number(n)
    }
}

namespace leetcode.numbers_with_repeated_digits;

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

micro pow2(k: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < k {
        result = result * 2
        i = i + 1
    }
    return result
}

micro digit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        count = count + 1
        rest = rest / 10
    }
    return count
}

micro digit_at(x: i64, p: i64) -> i64 {
    return (x / pow10(p)) % 10
}

# P(a, b) = a·(a-1)·...·(a-b+1)。
micro perm(a: i64, b: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < b {
        result = result * (a - i)
        i = i + 1
    }
    return result
}

# ≤ n 且各位唯一者计数：短位全计 + 等长逐位贴合前缀。
micro count_unique_digits(n: i64) -> i64 {
    if n < 1 {
        return 1
    }
    let digits: i64 = digit_count(n)
    let mut total: i64 = 0
    let mut length: i64 = 1
    while length < digits {
        total = total + 9 * perm(9, length - 1)
        length = length + 1
    }
    let mut used: i64 = 0
    let mut i: i64 = 0
    while i < digits {
        let place: i64 = digits - 1 - i
        let bound: i64 = digit_at(n, place)
        let mut d: i64 = 0
        if i == 0 {
            d = 1
        }
        while d < bound {
            if used / pow2(d) % 2 == 0 {
                total = total + perm(10 - i - 1, digits - i - 1)
            }
            d = d + 1
        }
        if used / pow2(bound) % 2 == 1 {
            return total
        }
        used = used + pow2(bound)
        i = i + 1
    }
    return total + 1
}

[export(case: "camelCase")]
micro num_dup_digits_at_most_n(n: i64) -> i64 {
    return n - count_unique_digits(n)
}

class Solution {
    micro numDupDigitsAtMostN(self, n: i64): i64 {
        return num_dup_digits_at_most_n(n)
    }
}

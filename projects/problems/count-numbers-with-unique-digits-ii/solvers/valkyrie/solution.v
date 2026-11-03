namespace leetcode.count_numbers_with_unique_digits_ii;

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

micro digit_at(x: i64, p: i64) -> i64 {
    return (x / pow10(p)) % 10
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

micro has_unique_digits(x: i64) -> bool {
    let digits: i64 = digit_count(x)
    let mut i: i64 = 0
    while i < digits {
        let mut j: i64 = i + 1
        while j < digits {
            if digit_at(x, i) == digit_at(x, j) {
                return false
            }
            j = j + 1
        }
        i = i + 1
    }
    return true
}

[export(case: "camelCase")]
micro number_count(a: i64, b: i64) -> i64 {
    let mut count: i64 = 0
    let mut x: i64 = a
    while x <= b {
        if has_unique_digits(x) {
            count = count + 1
        }
        x = x + 1
    }
    return count
}

class Solution {
    micro numberCount(self, a: i64, b: i64): i64 {
        return number_count(a, b)
    }
}

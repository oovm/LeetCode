namespace leetcode.count_symmetric_integers;

micro digit_sum(x: i64) -> i64 {
    let mut sum: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        sum = sum + rest % 10
        rest = rest / 10
    }
    return sum
}

micro is_symmetric(x: i64) -> bool {
    let mut digits: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        digits = digits + 1
        rest = rest / 10
    }
    if digits % 2 == 1 {
        return false
    }
    let mut split: i64 = 1
    let mut i: i64 = digits / 2
    while i > 0 {
        split = split * 10
        i = i - 1
    }
    return digit_sum(x / split) == digit_sum(x % split)
}

[export(case: "camelCase")]
micro count_symmetric_integers(low: i64, high: i64) -> i64 {
    let mut count: i64 = 0
    let mut x: i64 = low
    while x <= high {
        if is_symmetric(x) {
            count = count + 1
        }
        x = x + 1
    }
    return count
}

class Solution {
    micro countSymmetricIntegers(self, low: i64, high: i64): i64 {
        return count_symmetric_integers(low, high)
    }
}

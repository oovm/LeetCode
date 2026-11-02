namespace leetcode.sum_of_number_and_its_reverse;

micro reverse_of(x: i64) -> i64 {
    let mut result: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        result = result * 10 + rest % 10
        rest = rest / 10
    }
    return result
}

[export(case: "camelCase")]
micro sum_of_number_and_reverse(num: i64) -> bool {
    let mut k: i64 = 0
    while k <= num {
        if k + reverse_of(k) == num {
            return true
        }
        k = k + 1
    }
    return false
}

class Solution {
    micro sumOfNumberAndReverse(self, num: i64): bool {
        return sum_of_number_and_reverse(num)
    }
}

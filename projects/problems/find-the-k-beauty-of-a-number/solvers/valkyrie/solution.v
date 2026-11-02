namespace leetcode.find_the_k_beauty_of_a_number;

micro pow10(k: i64) -> i64 {
    let mut base: i64 = 1
    let mut j: i64 = 0
    while j < k {
        base = base * 10
        j = j + 1
    }
    return base
}

[export(case: "camelCase")]
micro divisor_substrings(num: i64, k: i64) -> i64 {
    let mut digits: i64 = 0
    let mut rest: i64 = num
    while rest > 0 {
        digits = digits + 1
        rest = rest / 10
    }
    let mut ans: i64 = 0
    let mut s: i64 = 0
    while s + k <= digits {
        let window: i64 = num / pow10(digits - s - k) % pow10(k)
        if window != 0 && num % window == 0 {
            ans = ans + 1
        }
        s = s + 1
    }
    return ans
}

class Solution {
    micro divisorSubstrings(self, num: i64, k: i64): i64 {
        return divisor_substrings(num, k)
    }
}

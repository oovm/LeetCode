namespace leetcode.sum_of_digits_of_string_after_convert;

[export(case: "camelCase")]
micro get_lucky(s: utf8, k: i64) -> i64 {
    let n: usize = s.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < n {
        let value: i64 = s⁅i⁆ as u32 as i64 - 96
        total = total + value % 10 + value / 10
        i = i + 1
    }
    let mut round: i64 = 1
    while round < k {
        let mut next: i64 = 0
        while total > 0 {
            next = next + total % 10
            total = total / 10
        }
        total = next
        round = round + 1
    }
    return total
}

class Solution {
    micro getLucky(self, s: utf8, k: i64): i64 {
        return get_lucky(s, k)
    }
}

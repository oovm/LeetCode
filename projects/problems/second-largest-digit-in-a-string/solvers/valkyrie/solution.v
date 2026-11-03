namespace leetcode.second_largest_digit_in_a_string;

[export(case: "camelCase")]
micro second_highest(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut first: i64 = -1
    let mut second: i64 = -1
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if code >= 48 && code <= 57 {
            let digit: i64 = code - 48
            if digit > first {
                second = first
                first = digit
            } else if digit < first && digit > second {
                second = digit
            }
        }
        i = i + 1
    }
    return second
}

class Solution {
    micro secondHighest(self, s: utf8): i64 {
        return second_highest(s)
    }
}

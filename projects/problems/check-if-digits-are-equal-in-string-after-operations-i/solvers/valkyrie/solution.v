namespace leetcode.check_if_digits_are_equal_in_string_after_operations_i;

# 反复以相邻两位之和 mod 10 就地缩并，直至只剩两位。
[export(case: "camelCase")]
micro has_same_digits(s: utf8) -> bool {
    let n: usize = s.length()
    let mut digits: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        digits.push(s⁅i⁆ as u32 as i64 - 48)
        i = i + 1
    }
    while digits.length() > 2 {
        let mut previous: i64 = digits⁅0⁆.unwrap()
        let mut j: usize = 1
        while j < digits.length() {
            let current: i64 = digits⁅j⁆.unwrap()
            let slot: usize = j - 1
            digits⁅slot⁆ = (previous + current) % 10
            previous = current
            j = j + 1
        }
        digits.pop()
    }
    return digits⁅0⁆.unwrap() == digits⁅1⁆.unwrap()
}

class Solution {
    micro hasSameDigits(self, s: utf8): bool {
        return has_same_digits(s)
    }
}

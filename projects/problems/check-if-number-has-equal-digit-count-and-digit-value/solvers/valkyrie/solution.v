namespace leetcode.check_if_number_has_equal_digit_count_and_digit_value;

[export(case: "camelCase")]
micro digit_count(num: utf8) -> bool {
    let n: usize = num.length()
    let mut counts: ArrayList<i64> = ArrayList::new(10)
    let mut i: usize = 0
    while i < 10 {
        counts.push(0)
        i = i + 1
    }
    i = 0
    while i < n {
        let d: i64 = num⁅i⁆ as u32 as i64 - 48
        counts⁅d as usize⁆ = counts⁅d as usize⁆ + 1
        i = i + 1
    }
    i = 0
    while i < n {
        if i >= 10 {
            return false
        }
        let d: i64 = num⁅i⁆ as u32 as i64 - 48
        if counts⁅i⁆ != d {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro digitCount(self, num: utf8): bool {
        return digit_count(num)
    }
}

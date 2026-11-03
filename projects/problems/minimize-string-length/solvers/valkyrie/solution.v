namespace leetcode.minimize_string_length;

[export(case: "camelCase")]
micro minimized_string_length(s: utf8) -> i64 {
    let mut seen: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        seen.push(0)
        i = i + 1
    }
    let mut total: i64 = 0
    i = 0
    while i < s.length() {
        let idx: usize = (s⁅i⁆ as u32 - 97) as usize
        if seen⁅idx⁆.unwrap() == 0 {
            seen⁅idx⁆ = 1
            total = total + 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro minimizedStringLength(self, s: utf8): i64 {
        return minimized_string_length(s)
    }
}

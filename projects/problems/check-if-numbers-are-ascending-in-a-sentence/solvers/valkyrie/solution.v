namespace leetcode.check_if_numbers_are_ascending_in_a_sentence;

[export(case: "camelCase")]
micro are_numbers_ascending(s: utf8) -> bool {
    let n: usize = s.length()
    let mut previous: i64 = -1
    let mut i: usize = 0
    while i < n {
        while i < n && (s⁅i⁆ as u32 as i64) == 32 {
            i = i + 1
        }
        if i < n {
            let mut j: usize = i
            while j < n && (s⁅j⁆ as u32 as i64) != 32 {
                j = j + 1
            }
            let mut value: i64 = 0
            let mut numeric: bool = true
            let mut k: usize = i
            while k < j {
                let code: i64 = s⁅k⁆ as u32 as i64
                if code >= 48 && code <= 57 {
                    value = value * 10 + (code - 48)
                } else {
                    numeric = false
                }
                k = k + 1
            }
            if numeric {
                if value <= previous {
                    return false
                }
                previous = value
            }
            i = j
        }
    }
    return true
}

class Solution {
    micro areNumbersAscending(self, s: utf8): bool {
        return are_numbers_ascending(s)
    }
}

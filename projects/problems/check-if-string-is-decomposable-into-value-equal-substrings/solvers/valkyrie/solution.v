namespace leetcode.check_if_string_is_decomposable_into_value_equal_substrings;

[export(case: "camelCase")]
micro is_decomposable(s: utf8) -> bool {
    let n: usize = s.length()
    let mut twos: i64 = 0
    let mut i: usize = 0
    while i < n {
        let base: i64 = s⁅i⁆ as u32 as i64
        let mut j: usize = i + 1
        while j < n && (s⁅j⁆ as u32 as i64) == base {
            j = j + 1
        }
        let run: i64 = (j - i) as i64
        let remainder: i64 = run % 3
        if remainder == 1 {
            return false
        }
        if remainder == 2 {
            twos = twos + 1
            if twos > 1 {
                return false
            }
        }
        i = j
    }
    return twos == 1
}

class Solution {
    micro isDecomposable(self, s: utf8): bool {
        return is_decomposable(s)
    }
}

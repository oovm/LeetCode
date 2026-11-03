namespace leetcode.check_if_one_string_swap_can_make_strings_equal;

[export(case: "camelCase")]
micro are_almost_equal(s1: utf8, s2: utf8) -> bool {
    let n: usize = s1.length()
    if n != s2.length() {
        return false
    }
    let mut first: i64 = -1
    let mut second: i64 = -1
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < n {
        let a: i64 = s1⁅i⁆ as u32 as i64
        let b: i64 = s2⁅i⁆ as u32 as i64
        if a != b {
            count = count + 1
            if count == 1 {
                first = i as i64
            } else if count == 2 {
                second = i as i64
            } else {
                return false
            }
        }
        i = i + 1
    }
    if count == 0 {
        return true
    }
    if count == 2 {
        let x: usize = first as usize
        let y: usize = second as usize
        if (s1⁅x⁆ as u32 as i64) == (s2⁅y⁆ as u32 as i64) && (s1⁅y⁆ as u32 as i64) == (s2⁅x⁆ as u32 as i64) {
            return true
        }
    }
    return false
}

class Solution {
    micro areAlmostEqual(self, s1: utf8, s2: utf8): bool {
        return are_almost_equal(s1, s2)
    }
}

namespace leetcode.check_if_binary_string_has_at_most_one_segment_of_ones;

[export(case: "camelCase")]
micro check_ones_segment(s: utf8) -> bool {
    let n: usize = s.length()
    let mut segments: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if code == 49 {
            if i == 0 || (s⁅i - 1⁆ as u32 as i64) != 49 {
                segments = segments + 1
            }
        }
        i = i + 1
    }
    return segments <= 1
}

class Solution {
    micro checkOnesSegment(self, s: utf8): bool {
        return check_ones_segment(s)
    }
}

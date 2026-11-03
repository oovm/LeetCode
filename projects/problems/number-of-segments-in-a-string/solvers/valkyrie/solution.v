namespace leetcode.number_of_segments_in_a_string;

# 空白字符判定，覆盖空格、制表与换行
micro is_blank(code: u32) -> bool {
    return code == 32 || code == 9 || code == 10 || code == 13 || code == 11 || code == 12
}

# 统计连续非空白段，O(n)
[export(case: "camelCase")]
micro count_segments(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut segments: i64 = 0
    let mut in_segment: bool = false
    let mut i: usize = 0
    while i < n {
        if is_blank(s⁅i⁆ as u32) {
            in_segment = false
        } else {
            if !in_segment {
                segments = segments + 1
                in_segment = true
            }
        }
        i = i + 1
    }
    return segments
}

class Solution {
    micro countSegments(self, s: utf8): i64 {
        return count_segments(s)
    }
}

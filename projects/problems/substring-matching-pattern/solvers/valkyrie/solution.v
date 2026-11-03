namespace leetcode.substring_matching_pattern;

micro segment_from(s: utf8, p: utf8, begin: usize, end: usize, from: usize) -> i64 {
    let width: usize = end - begin
    let n: usize = s.length()
    let mut i: usize = from
    while i + width <= n {
        let mut j: usize = 0
        let mut matched: bool = true
        while j < width && matched {
            if (s⁅i + j⁆ as u32) != (p⁅begin + j⁆ as u32) {
                matched = false
            }
            j = j + 1
        }
        if matched {
            return i as i64
        }
        i = i + 1
    }
    return -1
}

# 按 '*' 切成若干字面段，段间可跳过任意字符，依次在 s 中定位即匹配。
[export(case: "camelCase")]
micro has_match(s: utf8, p: utf8) -> bool {
    let m: usize = p.length()
    let mut cursor: usize = 0
    let mut i: usize = 0
    while i < m {
        let mut j: usize = i
        while j < m && (p⁅j⁆ as u32) != 42 {
            j = j + 1
        }
        if j > i {
            let found: i64 = segment_from(s, p, i, j, cursor)
            if found < 0 {
                return false
            }
            cursor = found as usize + (j - i)
        }
        i = j + 1
    }
    return true
}

class Solution {
    micro hasMatch(self, s: utf8, p: utf8): bool {
        return has_match(s, p)
    }
}

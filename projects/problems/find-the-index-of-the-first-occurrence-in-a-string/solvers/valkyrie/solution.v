namespace leetcode.find_the_index_of_the_first_occurrence_in_a_string;

# KMP 前缀函数，O(m)
micro build_failure(pattern: utf8) -> ArrayList<i64> {
    let n: usize = pattern.length()
    let mut fail: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        fail.push(0)
        i = i + 1
    }
    let mut k: usize = 1
    let mut j: usize = 0
    while k < n {
        while j > 0 && (pattern⁅k⁆ as u32) != (pattern⁅j⁆ as u32) {
            j = fail⁅j - 1⁆.unwrap() as usize
        }
        if (pattern⁅k⁆ as u32) == (pattern⁅j⁆ as u32) {
            j = j + 1
        }
        fail⁅k⁆ = j as i64
        k = k + 1
    }
    return fail
}

[export(case: "camelCase")]
micro str_str(haystack: utf8, needle: utf8) -> i64 {
    let m: usize = needle.length()
    let n: usize = haystack.length()
    if m == 0 {
        return 0
    }
    let fail: ArrayList<i64> = build_failure(needle)
    let mut i: usize = 0
    let mut j: usize = 0
    while i < n {
        while j > 0 && (haystack⁅i⁆ as u32) != (needle⁅j⁆ as u32) {
            j = fail⁅j - 1⁆.unwrap() as usize
        }
        if (haystack⁅i⁆ as u32) == (needle⁅j⁆ as u32) {
            j = j + 1
        }
        if j == m {
            return (i - m + 1) as i64
        }
        i = i + 1
    }
    return -1
}

class Solution {
    micro strStr(self, haystack: utf8, needle: utf8): i64 {
        return str_str(haystack, needle)
    }
}

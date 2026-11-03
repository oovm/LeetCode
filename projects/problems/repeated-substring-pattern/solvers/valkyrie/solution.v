namespace leetcode.repeated_substring_pattern;

# KMP 前缀表
micro prefix_table(pattern: utf8) -> ArrayList<i64> {
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
            j = fail⁅j - 1⁆ as usize
        }
        if (pattern⁅k⁆ as u32) == (pattern⁅j⁆ as u32) {
            j = j + 1
        }
        fail⁅k⁆ = j as i64
        k = k + 1
    }
    return fail
}

# 最长公共前后缀给出最小周期，O(n)
[export(case: "camelCase")]
micro repeated_substring_pattern(s: utf8) -> bool {
    let n: usize = s.length()
    if n <= 1 {
        return false
    }
    let fail: ArrayList<i64> = prefix_table(s)
    let border: i64 = fail⁅n - 1⁆
    let period: i64 = n as i64 - border
    if (n as i64) % period != 0 {
        return false
    }
    return (n as i64) / period > 1
}

class Solution {
    micro repeatedSubstringPattern(self, s: utf8): bool {
        return repeated_substring_pattern(s)
    }
}

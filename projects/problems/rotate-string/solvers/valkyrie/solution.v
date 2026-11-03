namespace leetcode.rotate_string;

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

# 在 s + s 上做 KMP 匹配，O(n)
[export(case: "camelCase")]
micro rotate_string(s: utf8, goal: utf8) -> bool {
    let n: usize = s.length()
    let m: usize = goal.length()
    if n != m {
        return false
    }
    if m == 0 {
        return true
    }
    let fail: ArrayList<i64> = build_failure(goal)
    let mut i: usize = 0
    let mut j: usize = 0
    while i < 2 * n {
        while j > 0 && (s⁅i % n⁆ as u32) != (goal⁅j⁆ as u32) {
            j = fail⁅j - 1⁆ as usize
        }
        if (s⁅i % n⁆ as u32) == (goal⁅j⁆ as u32) {
            j = j + 1
        }
        if j == m {
            return true
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro rotateString(self, s: utf8, goal: utf8): bool {
        return rotate_string(s, goal)
    }
}

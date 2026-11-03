namespace leetcode.maximum_nesting_depth_of_the_parentheses;

[export(case: "camelCase")]
micro max_depth(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut depth: i64 = 0
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: u32 = s⁅i⁆ as u32
        if code == 40 {
            depth = depth + 1
            if depth > best {
                best = depth
            }
        } else if code == 41 {
            depth = depth - 1
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxDepth(self, s: utf8): i64 {
        return max_depth(s)
    }
}

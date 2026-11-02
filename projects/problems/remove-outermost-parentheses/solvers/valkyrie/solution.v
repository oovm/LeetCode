namespace leetcode.remove_outermost_parentheses;

[export(case: "camelCase")]
micro remove_outer_parentheses(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut depth: i64 = 0
    let mut i: usize = 0
    while i < n {
        let c: u32 = s⁅i⁆ as u32
        if c == 40 {
            if depth > 0 {
                builder.append(s⁅i⁆)
            }
            depth = depth + 1
        } else {
            depth = depth - 1
            if depth > 0 {
                builder.append(s⁅i⁆)
            }
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro removeOuterParentheses(self, s: utf8): utf8 {
        return remove_outer_parentheses(s)
    }
}

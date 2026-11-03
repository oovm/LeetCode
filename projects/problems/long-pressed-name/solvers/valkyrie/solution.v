namespace leetcode.long_pressed_name;

# 贪心匹配，允许重复已匹配字符，O(n)
[export(case: "camelCase")]
micro is_long_pressed_name(name: utf8, typed: utf8) -> bool {
    let nn: usize = name.length()
    let tn: usize = typed.length()
    let mut i: usize = 0
    let mut j: usize = 0
    while j < tn {
        if i < nn && (name⁅i⁆ as u32) == (typed⁅j⁆ as u32) {
            i = i + 1
            j = j + 1
        } else if j > 0 && (typed⁅j⁆ as u32) == (typed⁅j - 1⁆ as u32) {
            j = j + 1
        } else {
            return false
        }
    }
    return i == nn
}

class Solution {
    micro isLongPressedName(self, name: utf8, typed: utf8): bool {
        return is_long_pressed_name(name, typed)
    }
}

namespace leetcode.number_of_changing_keys;

micro normalize(code: u32) -> u32 {
    if code >= 65 && code <= 90 {
        return code + 32
    }
    return code
}

# 相邻按键忽略大小写后不同即记一次变化。
[export(case: "camelCase")]
micro count_key_changes(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut changes: i64 = 0
    let mut i: usize = 1
    while i < n {
        let before: u32 = normalize(s⁅i - 1⁆ as u32)
        let after: u32 = normalize(s⁅i⁆ as u32)
        if before != after {
            changes = changes + 1
        }
        i = i + 1
    }
    return changes
}

class Solution {
    micro countKeyChanges(self, s: utf8): i64 {
        return count_key_changes(s)
    }
}

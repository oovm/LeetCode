namespace leetcode.minimum_changes_to_make_alternating_binary_string;

[export(case: "camelCase")]
micro min_operations(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut mismatches: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        let mut expected: i64 = 48
        if i % 2 == 1 {
            expected = 49
        }
        if code != expected {
            mismatches = mismatches + 1
        }
        i = i + 1
    }
    let total: i64 = n as i64
    let other: i64 = total - mismatches
    if mismatches < other {
        return mismatches
    }
    return other
}

class Solution {
    micro minOperations(self, s: utf8): i64 {
        return min_operations(s)
    }
}

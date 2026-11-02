namespace leetcode.split_a_string_in_balanced_strings;

[export(case: "camelCase")]
micro balanced_string_split(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut i: usize = 0
    let mut balance: i64 = 0
    let mut count: i64 = 0
    while i < n {
        let code: u32 = s.char_at(i + 1).unwrap() as u32
        if code == 76 {
            balance = balance + 1
        } else {
            balance = balance - 1
        }
        if balance == 0 {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro balancedStringSplit(self, s: utf8): i64 {
        return balanced_string_split(s)
    }
}

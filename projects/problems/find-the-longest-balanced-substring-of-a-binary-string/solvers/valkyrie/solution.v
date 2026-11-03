namespace leetcode.find_the_longest_balanced_substring_of_a_binary_string;

[export(case: "camelCase")]
micro find_the_longest_balanced_substring(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut best: i64 = 0
    let mut prev: i64 = 0
    let mut cur: i64 = 0
    let mut i: usize = 0
    while i < n {
        cur = cur + 1
        let code: u32 = s⁅i⁆ as u32
        let mut at_end: bool = false
        if i + 1 == n {
            at_end = true
        } else {
            let next: u32 = s⁅i + 1⁆ as u32
            if next != code {
                at_end = true
            }
        }
        if at_end {
            if code == 49 {
                let mut small: i64 = cur
                if prev < small {
                    small = prev
                }
                let span: i64 = small * 2
                if span > best {
                    best = span
                }
            }
            prev = cur
            cur = 0
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro findTheLongestBalancedSubstring(self, s: utf8): i64 {
        return find_the_longest_balanced_substring(s)
    }
}

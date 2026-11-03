namespace leetcode.consecutive_characters;

[export(case: "camelCase")]
micro max_power(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut best: i64 = 1
    let mut run: i64 = 1
    let mut i: usize = 1
    while i < n {
        if (s⁅i⁆ as u32) == (s⁅i - 1⁆ as u32) {
            run = run + 1
        } else {
            run = 1
        }
        if run > best {
            best = run
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxPower(self, s: utf8): i64 {
        return max_power(s)
    }
}

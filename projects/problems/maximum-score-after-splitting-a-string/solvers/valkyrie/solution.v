namespace leetcode.maximum_score_after_splitting_a_string;

[export(case: "camelCase")]
micro max_score(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut ones: i64 = 0
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) == 49 {
            ones = ones + 1
        }
        i = i + 1
    }
    let mut best: i64 = 0
    let mut zeros: i64 = 0
    i = 0
    while i + 1 < n {
        if (s⁅i⁆ as u32) == 48 {
            zeros = zeros + 1
        } else {
            ones = ones - 1
        }
        if zeros + ones > best {
            best = zeros + ones
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxScore(self, s: utf8): i64 {
        return max_score(s)
    }
}

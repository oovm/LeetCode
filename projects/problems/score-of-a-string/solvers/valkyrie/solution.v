namespace leetcode.score_of_a_string;

# 累加相邻字符码差的绝对值。
[export(case: "camelCase")]
micro score_of_string(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut score: i64 = 0
    let mut i: usize = 1
    while i < n {
        let before: i64 = s⁅i - 1⁆ as u32 as i64
        let current: i64 = s⁅i⁆ as u32 as i64
        if current >= before {
            score = score + current - before
        } else {
            score = score + before - current
        }
        i = i + 1
    }
    return score
}

class Solution {
    micro scoreOfString(self, s: utf8): i64 {
        return score_of_string(s)
    }
}

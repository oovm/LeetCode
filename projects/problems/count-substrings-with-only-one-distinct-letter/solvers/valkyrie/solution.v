namespace leetcode.count_substrings_with_only_one_distinct_letter;

[export(case: "camelCase")]
micro count_letters(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut total: i64 = 0
    let mut run: i64 = 1
    let mut i: usize = 1
    while i <= n {
        if i < n && (s⁅i⁆ as u32) == (s⁅i - 1⁆ as u32) {
            run = run + 1
        } else {
            total = total + run * (run + 1) / 2
            run = 1
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro countLetters(self, s: utf8): i64 {
        return count_letters(s)
    }
}

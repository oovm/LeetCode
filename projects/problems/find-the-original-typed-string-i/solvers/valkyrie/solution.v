namespace leetcode.find_the_original_typed_string_i;

# 每种游程长度 L 提供 L 种可能，取冗余量 L-1 叠加到基值 1。
[export(case: "camelCase")]
micro possible_string_count(word: utf8) -> i64 {
    let n: usize = word.length()
    let mut total: i64 = 1
    let mut run: i64 = 1
    let mut i: usize = 1
    while i < n {
        if (word⁅i⁆ as u32) == (word⁅i - 1⁆ as u32) {
            run = run + 1
        } else {
            total = total + run - 1
            run = 1
        }
        i = i + 1
    }
    total = total + run - 1
    return total
}

class Solution {
    micro possibleStringCount(self, word: utf8): i64 {
        return possible_string_count(word)
    }
}

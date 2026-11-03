namespace leetcode.minimum_time_to_type_word_using_special_typewriter;

[export(case: "camelCase")]
micro min_time_to_type(word: utf8) -> i64 {
    let n: usize = word.length()
    let mut time: i64 = 0
    let mut current: i64 = 0
    let mut i: usize = 0
    while i < n {
        let target: i64 = word⁅i⁆ as u32 as i64 - 97
        let mut diff: i64 = target - current
        if diff < 0 {
            diff = 0 - diff
        }
        let mut step: i64 = diff
        let around: i64 = 26 - diff
        if around < step {
            step = around
        }
        time = time + step + 1
        current = target
        i = i + 1
    }
    return time
}

class Solution {
    micro minTimeToType(self, word: utf8): i64 {
        return min_time_to_type(word)
    }
}

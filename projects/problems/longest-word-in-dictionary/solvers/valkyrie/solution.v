namespace leetcode.longest_word_in_dictionary;

using std.collection;

# std 的 `utf8` 没有 `Comparable`（G13），字典序只能自带比较器。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: usize = left.length()
    let right_length: usize = right.length()
    let mut index: usize = 0
    while index < left_length && index < right_length {
        let left_code: u32 = left⁅index⁆ as u32
        let right_code: u32 = right⁅index⁆ as u32
        if left_code < right_code {
            return -1
        }
        if left_code > right_code {
            return 1
        }
        index = index + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

# 主键长度降序，次键字典序升序；首个可逐字构造的候选即答案。
micro compare_candidates(left: utf8, right: utf8) -> i32 {
    if left.length() > right.length() {
        return -1
    }
    if left.length() < right.length() {
        return 1
    }
    return compare_text(left, right)
}

[export(case: "camelCase")]
micro longest_word(words: ArrayList<utf8>) -> utf8 {
    let mut present: HashSet<utf8> = HashSet::new()
    loop word in words {
        present.insert(word)
    }

    let ordered: ArrayList<utf8> = sorted_by(words, compare_candidates)
    let mut i: usize = 0
    while i < ordered.length() {
        let candidate: utf8 = ordered⁅i⁆
        let mut buildable: bool = true
        let mut size: usize = 1
        while size < candidate.length() {
            if !present.contains(candidate.slice(0, size)) {
                buildable = false
            }
            size = size + 1
        }
        if buildable {
            return candidate
        }
        i = i + 1
    }
    return ""
}

class Solution {
    micro longestWord(self, words: ArrayList<utf8>): utf8 {
        return longest_word(words)
    }
}

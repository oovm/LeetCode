namespace leetcode.string_matching_in_an_array;

using std.collection;

# 子串判定直接走 `utf8.contains`（内部即 `index_of` 的 Option 化封装），不手写扫描。
# 双重循环保留「i != j」语义：同值但不同下标的词也要各算一次命中。
[export(case: "camelCase")]
micro string_matching(words: ArrayList<utf8>) -> ArrayList<utf8> {
    let count: usize = words.length()
    let mut result: ArrayList<utf8> = ArrayList::new(0)

    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        let mut matched: bool = false
        let mut j: usize = 0
        while j < count {
            if i != j {
                let other: utf8 = words⁅j⁆
                if other.contains(word) {
                    matched = true
                }
            }
            j = j + 1
        }
        if matched {
            result.push(word)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro stringMatching(self, words: ArrayList<utf8>): ArrayList<utf8> {
        return string_matching(words)
    }
}

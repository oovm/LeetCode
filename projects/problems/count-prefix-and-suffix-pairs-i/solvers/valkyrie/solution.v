namespace leetcode.count_prefix_and_suffix_pairs_i;

using std.collection;

# 前缀与后缀两个既有谓词组合即可；`ends_with` 与 `starts_with` 对称，无需切片比较。
[export(case: "camelCase")]
micro count_prefix_suffix_pairs(words: ArrayList<utf8>) -> i64 {
    let mut pairs: i64 = 0
    let mut i: usize = 0
    while i < words.length() {
        let inner: utf8 = words⁅i⁆
        let mut j: usize = i + 1
        while j < words.length() {
            let outer: utf8 = words⁅j⁆
            if outer.starts_with(inner) && outer.ends_with(inner) {
                pairs = pairs + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    return pairs
}

class Solution {
    micro countPrefixSuffixPairs(self, words: ArrayList<utf8>): i64 {
        return count_prefix_suffix_pairs(words)
    }
}

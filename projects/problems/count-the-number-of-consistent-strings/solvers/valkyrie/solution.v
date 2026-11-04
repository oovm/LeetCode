namespace leetcode.count_the_number_of_consistent_strings;

using std.collection;

# 26 位掩码承载字符集：`char` 既无 `Hash`（G17）也无 `Comparable`（G15），
# 进不了哈希容器也进不了有序容器；ASCII 小写字母域内用寄存器位宽掩码是更优表达。
[export(case: "camelCase")]
micro count_consistent_strings(allowed: utf8, words: [utf8]) -> i64 {
    let mut allowed_mask: u32 = 0
    let allowed_length: usize = allowed.length()
    let mut i: usize = 0
    while i < allowed_length {
        let code: u32 = allowed⁅i⁆ as u32
        allowed_mask = allowed_mask | ((1 as u32) << (code - 97))
        i = i + 1
    }

    let mut consistent: i64 = 0
    let mut w: usize = 0
    while w < words.length() {
        let word: utf8 = words⁅w⁆
        let word_length: usize = word.length()
        let mut covered: bool = true
        let mut j: usize = 0
        while j < word_length && covered {
            let code: u32 = word⁅j⁆ as u32
            if (allowed_mask & ((1 as u32) << (code - 97))) == 0 {
                covered = false
            }
            j = j + 1
        }
        if covered {
            consistent = consistent + 1
        }
        w = w + 1
    }
    return consistent
}

class Solution {
    micro countConsistentStrings(self, allowed: utf8, words: [utf8]): i64 {
        return count_consistent_strings(allowed, words)
    }
}

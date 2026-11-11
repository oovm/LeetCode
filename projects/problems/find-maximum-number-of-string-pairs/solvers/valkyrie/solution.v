namespace leetcode.find_maximum_number_of_string_pairs;

using std.collection;
using std.text;

# 暴力配对：n <= 100，逐对比较 `words⁅j⁆` 与 `words⁅i⁆` 的反转串；反转走 `Utf8Builder` 倒序 append。
micro reversed(word: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    let mut i: usize = word.length()
    while i > 0 {
        i = i - 1
        builder.append(word⁅i⁆)
    }
    return builder.build()
}

[export(case: "camelCase")]
micro maximumNumberOfStringPairs(words: [utf8]) -> i64 {
    let n: usize = words.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i + 1 < n {
        let target: utf8 = reversed(words⁅i⁆)
        let mut j: usize = i + 1
        while j < n {
            if words⁅j⁆ == target {
                count = count + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro maximumNumberOfStringPairs(self, words: [utf8]): i64 {
        return maximumNumberOfStringPairs(words)
    }
}

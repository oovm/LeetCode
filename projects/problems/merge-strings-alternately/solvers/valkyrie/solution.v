namespace leetcode.merge_strings_alternately;

[export(case: "camelCase")]
micro merge_alternately(word1: utf8, word2: utf8) -> utf8 {
    let n1: usize = word1.length()
    let n2: usize = word2.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n1 + n2)
    let mut i: usize = 0
    while i < n1 || i < n2 {
        if i < n1 {
            builder.append(word1⁅i⁆)
        }
        if i < n2 {
            builder.append(word2⁅i⁆)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro mergeAlternately(self, word1: utf8, word2: utf8): utf8 {
        return merge_alternately(word1, word2)
    }
}

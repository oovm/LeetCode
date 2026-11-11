namespace leetcode.find_resultant_array_after_removing_anagrams;

using std.collection;

# 异位词的规范形就是「字符多重集」；逐词建 `MultiSet<char>`，相邻两个规范形相等即删除后词。
# 题内触发点: G24 —— `MultiSet` 没有 `equals` / `Equal` impl（`imply MultiSet<T>` 只声明了
# 增删查与长度），也没有任何规范序导出（`to_list()` 的顺序取决于内部哈希遍历），
# 因此两个多重集实例无法判等价，也无法当哈希键。
# 题内触发点: G17 —— `MultiSet` 内部就是 `HashMap`，键必须 `Hash`，而 `char` 只有 `==`/`!=`。
micro anagram_key(word: utf8) -> MultiSet<char> {
    let count: usize = word.length()
    let mut chars: ArrayList<char> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        chars.push(word⁅i⁆)
        i = i + 1
    }
    return MultiSet::from_list(chars)
}

[export(case: "camelCase")]
micro remove_anagrams(words: [utf8]) -> [utf8] {
    let count: usize = words.length()
    let mut keys: ArrayList<MultiSet<char>> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        keys.push(anagram_key(word))
        i = i + 1
    }

    let mut result: ArrayList<utf8> = ArrayList::new(0)
    i = 0
    while i < count {
        if i == 0 {
            result.push(words⁅i⁆)
        } else {
            let same: bool = keys⁅i⁆ == keys⁅i - 1⁆
            if !same {
                result.push(words⁅i⁆)
            }
        }
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro removeAnagrams(self, words: [utf8]): [utf8] {
        return remove_anagrams(words)
    }
}

namespace leetcode.count_common_words_with_one_occurrence;

using std.collection;

# 两张词频表；只在左侧频次为 1 的键上查右侧，右侧缺席即「不是单次」。
micro build_counts(words: [utf8]) -> HashMap<utf8, i64> {
    let count: usize = words.length()
    let mut counts: HashMap<utf8, i64> = HashMap::new(count)
    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        let mut seen: i64 = 0
        if counts.contains_key(word) {
            seen = counts.get(word).unwrap()
        }
        counts.insert(word, seen + 1)
        i = i + 1
    }
    return counts
}

# 键遍历走 `keys()` 物化，避免在回调里改外层计数。
[export(case: "camelCase")]
micro count_words(words1: [utf8], words2: [utf8]) -> i64 {
    let first: HashMap<utf8, i64> = build_counts(words1)
    let second: HashMap<utf8, i64> = build_counts(words2)
    let keys: ArrayList<utf8> = first.keys()

    let mut common: i64 = 0
    let mut i: usize = 0
    while i < keys.length() {
        let word: utf8 = keys⁅i⁆
        let left: Option<i64> = first.get(word)
        let right: Option<i64> = second.get(word)
        if left.is_some() && left.unwrap() == 1 && right.is_some() && right.unwrap() == 1 {
            common = common + 1
        }
        i = i + 1
    }
    return common
}

class Solution {
    micro countWords(self, words1: [utf8], words2: [utf8]): i64 {
        return count_words(words1, words2)
    }
}

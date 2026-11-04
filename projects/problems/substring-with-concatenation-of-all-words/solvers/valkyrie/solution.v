namespace leetcode.substring_with_concatenation_of_all_words;

using std.collection;

# 按单词长度分偏移量做滑窗：窗口内单词计数与词表需求逐键比对；
# 遇到词表外的单词整窗清空（压 `HashMap.clear()`），超额时从左侧逐词剔除（压 `remove`）。
# 题内触发点: G13 —— `utf8` 无码点视图，切片靠 `slice(start, count)` 的字节偏移。
# 题内触发点: `HashMap` 删除/清空面 —— `clear()` 与 `remove(k)` 首次成对出现。
[export(case: "camelCase")]
micro find_substring(s: utf8, words: ArrayList<utf8>) -> ArrayList<i64> {
    let text_len: usize = s.byte_length()
    let count: usize = words.length()
    let mut result: ArrayList<i64> = ArrayList::new(text_len)
    if count == 0 {
        return result
    }
    let word_len: usize = words⁅0⁆.byte_length()
    if word_len == 0 {
        return result
    }
    let total_len: usize = word_len * count
    if total_len > text_len {
        return result
    }

    let mut need: HashMap<utf8, i64> = HashMap::new(count)
    loop word in words {
        if need.contains_key(word) {
            need.insert(word, need.get(word).unwrap() + 1)
        } else {
            need.insert(word, 1)
        }
    }
    let distinct: usize = need.length()

    let mut offset: usize = 0
    while offset < word_len {
        let mut window: HashMap<utf8, i64> = HashMap::new(count)
        let mut matched: usize = 0
        let mut left: usize = offset
        let mut right: usize = offset
        while right + word_len <= text_len {
            let word: utf8 = s.slice(right, word_len)
            if need.contains_key(word) {
                let mut old: i64 = 0
                if window.contains_key(word) {
                    old = window.get(word).unwrap()
                }
                if old == need.get(word).unwrap() {
                    matched = matched - 1
                }
                window.insert(word, old + 1)
                if old + 1 == need.get(word).unwrap() {
                    matched = matched + 1
                }

                while right + word_len - left > total_len {
                    let gone: utf8 = s.slice(left, word_len)
                    let old_gone: i64 = window.get(gone).unwrap()
                    if old_gone == need.get(gone).unwrap() {
                        matched = matched - 1
                    }
                    if old_gone == 1 {
                        let dropped: Option<i64> = window.remove(gone)
                    } else {
                        window.insert(gone, old_gone - 1)
                        if old_gone - 1 == need.get(gone).unwrap() {
                            matched = matched + 1
                        }
                    }
                    left = left + word_len
                }

                if matched == distinct {
                    result.push(left as i64)
                }
            } else {
                window.clear()
                matched = 0
                left = right + word_len
            }
            right = right + word_len
        }
        offset = offset + 1
    }
    return result
}

class Solution {
    micro findSubstring(self, s: utf8, words: ArrayList<utf8>): ArrayList<i64> {
        return find_substring(s, words)
    }
}

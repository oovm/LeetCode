namespace leetcode.add_bold_tag_in_string;

using std.collection;

# 先在一张布尔表上标出所有被任一单词覆盖的字符区间，再顺序输出并合并相邻区间，
# 区间合并天然完成去重。O(串长·单词数·单词长)。
micro matches_at(s: utf8, word: utf8, start: usize) -> bool {
    let word_length: usize = word.byte_length()
    if start + word_length > s.byte_length() {
        return false
    }
    let mut offset: usize = 0
    while offset < word_length {
        if s.byte_at(start + offset) != word.byte_at(offset) {
            return false
        }
        offset = offset + 1
    }
    return true
}

[export(case: "camelCase")]
micro add_bold_tag(s: utf8, words: [utf8]) -> utf8 {
    let length: usize = s.byte_length()
    let mut covered: ArrayList<bool> = ArrayList::new(length)
    let mut index: usize = 0
    while index < length {
        covered.push(false)
        index = index + 1
    }

    index = 0
    while index < length {
        let mut word_index: usize = 0
        while word_index < words.length() {
            if matches_at(s, words⁅word_index⁆, index) {
                let word_length: usize = words⁅word_index⁆.byte_length()
                let mut offset: usize = 0
                while offset < word_length {
                    covered⁅index + offset⁆ = true
                    offset = offset + 1
                }
            }
            word_index = word_index + 1
        }
        index = index + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(length + 16)
    index = 0
    while index < length {
        if covered⁅index⁆ {
            if index == 0 || !covered⁅index - 1⁆ {
                builder.append(char::from(60))
                builder.append(char::from(98))
                builder.append(char::from(62))
            }
        }
        builder.append(char::from(s.byte_at(index) as u32))
        if covered⁅index⁆ {
            if index + 1 == length || !covered⁅index + 1⁆ {
                builder.append(char::from(60))
                builder.append(char::from(47))
                builder.append(char::from(98))
                builder.append(char::from(62))
            }
        }
        index = index + 1
    }
    return builder.build()
}

class Solution {
    micro addBoldTag(self, s: utf8, words: [utf8]): utf8 {
        return add_bold_tag(s, words)
    }
}

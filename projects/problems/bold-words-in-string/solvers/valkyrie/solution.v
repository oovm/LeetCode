namespace leetcode.bold_words_in_string;

using std.collection;

# 建 26 叉 Trie，对每个起点沿 Trie 走并标记命中区间，最后把最长连续标记段
# 用 `<b>` 包起来。总代价 O(|s| * 最长词长)。
micro node_new(next: ArrayList<i64>, terminal: ArrayList<i64>) -> i64 {
    let neg: i64 = -1
    let mut slot: usize = 0
    while slot < 26 {
        next.push(neg)
        slot = slot + 1
    }
    terminal.push(0)
    return (terminal.length() - 1) as i64
}

micro insert_word(next: ArrayList<i64>, terminal: ArrayList<i64>, word: utf8) -> unit {
    let mut node: i64 = 0
    let mut index: usize = 0
    while index < word.byte_length() {
        let code: i64 = (word.byte_at(index) as i64) - 97
        let slot: usize = (node * 26 + code) as usize
        let mut child: i64 = next⁅slot⁆
        if child < 0 {
            child = node_new(next, terminal)
            next⁅slot⁆ = child
        }
        node = child
        index = index + 1
    }
    terminal⁅node as usize⁆ = 1
}

[export(case: "camelCase")]
micro add_bold_tag(words: ArrayList<utf8>, s: utf8) -> utf8 {
    let mut next: ArrayList<i64> = ArrayList::new(26)
    let mut terminal: ArrayList<i64> = ArrayList::new(1)
    node_new(next, terminal)
    let mut word_index: usize = 0
    while word_index < words.length() {
        insert_word(next, terminal, words⁅word_index⁆)
        word_index = word_index + 1
    }

    let size: usize = s.byte_length()
    let mut marked: ArrayList<i64> = ArrayList::new(size)
    let mut index: usize = 0
    while index < size {
        marked.push(0)
        index = index + 1
    }
    index = 0
    while index < size {
        let mut node: i64 = 0
        let mut cursor: usize = index
        while cursor < size {
            let code: i64 = (s.byte_at(cursor) as i64) - 97
            if code < 0 || code > 25 {
                break
            }
            let slot: usize = (node * 26 + code) as usize
            let child: i64 = next⁅slot⁆
            if child < 0 {
                break
            }
            node = child
            if terminal⁅node as usize⁆ == 1 {
                let mut at: usize = index
                while at <= cursor {
                    marked⁅at⁆ = 1
                    at = at + 1
                }
            }
            cursor = cursor + 1
        }
        index = index + 1
    }

    let mut out: Utf8Builder = Utf8Builder::new(size + 16)
    index = 0
    while index < size {
        if marked⁅index⁆ == 1 {
            out.append(char::from(60))
            out.append(char::from(98))
            out.append(char::from(62))
            while index < size && marked⁅index⁆ == 1 {
                out.append(char::from(s.byte_at(index) as u32))
                index = index + 1
            }
            out.append(char::from(60))
            out.append(char::from(47))
            out.append(char::from(98))
            out.append(char::from(62))
        } else {
            out.append(char::from(s.byte_at(index) as u32))
            index = index + 1
        }
    }
    return out.build()
}

class Solution {
    micro addBoldTag(self, words: ArrayList<utf8>, s: utf8): utf8 {
        return add_bold_tag(words, s)
    }
}

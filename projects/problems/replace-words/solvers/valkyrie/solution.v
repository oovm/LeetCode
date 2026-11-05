namespace leetcode.replace_words;

using std.collection;

# 字典压成扁平 26 叉 Trie（节点连续存放），再对句中每个词走一次，
# 命中最早终止节点即用该前缀替换，总代价 O(总字符数)。
micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

micro slice_range(text: utf8, start: usize, stop: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(stop - start)
    let mut index: usize = start
    while index < stop {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

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

micro shortest_prefix(next: ArrayList<i64>, terminal: ArrayList<i64>, word: utf8) -> utf8 {
    let mut node: i64 = 0
    let mut index: usize = 0
    while index < word.byte_length() {
        let code: i64 = (word.byte_at(index) as i64) - 97
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
            return slice_range(word, 0, index + 1)
        }
        index = index + 1
    }
    return word
}

[export(case: "camelCase")]
micro replace_words(dictionary: ArrayList<utf8>, sentence: utf8) -> utf8 {
    let mut next: ArrayList<i64> = ArrayList::new(26)
    let mut terminal: ArrayList<i64> = ArrayList::new(1)
    node_new(next, terminal)
    let mut dictionary_index: usize = 0
    while dictionary_index < dictionary.length() {
        insert_word(next, terminal, dictionary⁅dictionary_index⁆)
        dictionary_index = dictionary_index + 1
    }

    let mut out: Utf8Builder = Utf8Builder::new(sentence.byte_length())
    let mut start: usize = 0
    let mut cursor: usize = 0
    let mut first_word: bool = true
    while cursor <= sentence.byte_length() {
        let at_end: bool = cursor == sentence.byte_length()
        let is_space: bool = !at_end && (sentence.byte_at(cursor) as i64) == 32
        if at_end || is_space {
            if !first_word {
                out.append(char::from(32))
            }
            let word: utf8 = slice_range(sentence, start, cursor)
            out.append(shortest_prefix(next, terminal, word))
            first_word = false
            start = cursor + 1
        }
        cursor = cursor + 1
    }
    return out.build()
}

class Solution {
    micro replaceWords(self, dictionary: ArrayList<utf8>, sentence: utf8): utf8 {
        return replace_words(dictionary, sentence)
    }
}

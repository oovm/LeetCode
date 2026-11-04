namespace leetcode.index_pairs_of_a_string;

using std.collection;
using std.text;

# `Utf8Builder::build` 会消耗构造器，因此每个终点都用新构造器按字符拼出子串。
micro slice_text(text: utf8, start: usize, count: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(count)
    let mut offset: usize = 0
    while offset < count {
        builder.append(char::from(text⁅start + offset⁆ as u32))
        offset = offset + 1
    }
    return builder.build()
}

# 词表 `words` 可能含重复项，先去重成 `HashSet<utf8>`；
# 按起点递增、终点递增枚举子串，天然得到题面要求的区间顺序。
[export(case: "camelCase")]
micro indexPairs(text: utf8, words: ArrayList<utf8>) -> ArrayList<ArrayList<i64>> {
    let mut dictionary: HashSet<utf8> = HashSet::new()
    loop word in words {
        dictionary.insert(word)
    }

    let length: usize = text.length()
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let mut start: usize = 0
    while start < length {
        let mut finish: usize = start
        while finish < length {
            let candidate: utf8 = slice_text(text, start, finish - start + 1)
            if dictionary.contains(candidate) {
                let mut pair: ArrayList<i64> = ArrayList::new(2)
                pair.push(start as i64)
                pair.push(finish as i64)
                result.push(pair)
            }
            finish = finish + 1
        }
        start = start + 1
    }
    return result
}

class Solution {
    micro indexPairs(self, text: utf8, words: ArrayList<utf8>): ArrayList<ArrayList<i64>> {
        return indexPairs(text, words)
    }
}

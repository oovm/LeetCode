namespace leetcode.word_break;

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

# 前缀可达性 DP：`reachable[k]` 表示 `s` 的前 `k` 个字符可切分。
# 字典用 `HashSet<utf8>`，从每个可达起点向后增量匹配。
[export(case: "camelCase")]
micro wordBreak(s: utf8, wordDict: ArrayList<utf8>) -> bool {
    let mut dictionary: HashSet<utf8> = HashSet::new()
    loop word in wordDict {
        dictionary.insert(word)
    }

    let length: usize = s.length()
    let mut reachable: ArrayList<bool> = ArrayList::new(length + 1)
    let mut i: usize = 0
    while i <= length {
        reachable.push(false)
        i = i + 1
    }
    reachable.set(1 as isize, true)

    let mut start: usize = 0
    while start < length {
        if reachable⁅start⁆ {
            let mut finish: usize = start + 1
            while finish <= length {
                let candidate: utf8 = slice_text(s, start, finish - start)
                if dictionary.contains(candidate) {
                    reachable.set((finish + 1) as isize, true)
                }
                finish = finish + 1
            }
        }
        start = start + 1
    }
    return reachable⁅length⁆
}

class Solution {
    micro wordBreak(self, s: utf8, wordDict: ArrayList<utf8>): bool {
        return wordBreak(s, wordDict)
    }
}

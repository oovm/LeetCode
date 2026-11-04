namespace leetcode.number_of_distinct_substrings_in_a_string;

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

# 枚举全部子串放进 `HashSet<utf8>` 去重，集合大小即答案。
[export(case: "camelCase")]
micro countDistinct(s: utf8) -> i64 {
    let length: usize = s.length()
    let mut seen: HashSet<utf8> = HashSet::new()
    let mut start: usize = 0
    while start < length {
        let mut finish: usize = start
        while finish < length {
            seen.insert(slice_text(s, start, finish - start + 1))
            finish = finish + 1
        }
        start = start + 1
    }
    return seen.length() as i64
}

class Solution {
    micro countDistinct(self, s: utf8): i64 {
        return countDistinct(s)
    }
}

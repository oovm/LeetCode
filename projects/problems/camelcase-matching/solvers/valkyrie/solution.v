namespace leetcode.camelcase_matching;

using std.collection;

micro is_lower(code: u32) -> bool {
    if code >= 97 {
        if code <= 122 {
            return true
        }
    }
    return false
}

# 贪心双指针：模式字符前只允许跳过查询串的小写字符，最后剩余字符必须全为小写。
micro matches(query: utf8, pattern: utf8) -> bool {
    let query_length: usize = query.length()
    let pattern_length: usize = pattern.length()
    let mut qi: usize = 0
    let mut pi: usize = 0
    while pi < pattern_length {
        while qi < query_length {
            let mine: u32 = query⁅qi⁆ as u32
            let theirs: u32 = pattern⁅pi⁆ as u32
            if mine == theirs {
                break
            }
            if is_lower(mine) == false {
                break
            }
            qi = qi + 1
        }
        if qi == query_length {
            return false
        }
        let mine: u32 = query⁅qi⁆ as u32
        let theirs: u32 = pattern⁅pi⁆ as u32
        if mine != theirs {
            return false
        }
        qi = qi + 1
        pi = pi + 1
    }
    while qi < query_length {
        let mine: u32 = query⁅qi⁆ as u32
        if is_lower(mine) == false {
            return false
        }
        qi = qi + 1
    }
    return true
}

[export(case: "camelCase")]
micro camel_match(queries: ArrayList<utf8>, pattern: utf8) -> ArrayList<bool> {
    let mut result: ArrayList<bool> = ArrayList::new(queries.length())
    let mut index: usize = 0
    while index < queries.length() {
        result.push(matches(queries⁅index⁆, pattern))
        index = index + 1
    }
    return result
}

class Solution {
    micro camelMatch(self, queries: ArrayList<utf8>, pattern: utf8): ArrayList<bool> {
        return camel_match(queries, pattern)
    }
}

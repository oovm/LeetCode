namespace leetcode.valid_parentheses;

micro closing_code(open: u32) -> u32 {
    if open == 40 {
        return 41
    }
    if open == 91 {
        return 93
    }
    if open == 123 {
        return 125
    }
    return 0
}

micro is_bracket_code(code: u32) -> bool {
    if code == 40 || code == 41 {
        return true
    }
    if code == 91 || code == 93 {
        return true
    }
    if code == 123 || code == 125 {
        return true
    }
    return false
}

micro is_close_code(code: u32) -> bool {
    if code == 41 || code == 93 || code == 125 {
        return true
    }
    return false
}

# 递归下降：解析从 start 起的一段括号序列。
# closer 为 0 表示要求恰好读到串尾，否则要求消费对应的右括号。
# 成功返回下一个待读下标（closer 为 0 时等于串长），失败返回 -1。
micro parse_group(s: utf8, start: usize, closer: u32) -> i64 {
    let n: usize = s.length()
    let mut index: usize = start
    while index < n {
        let code: u32 = s.char_at(index + 1).unwrap() as u32
        if is_bracket_code(code) == false {
            return -1
        }
        if is_close_code(code) {
            if closer == 0 {
                return -1
            }
            if code != closer {
                return -1
            }
            return (index + 1) as i64
        }
        let next: i64 = parse_group(s, index + 1, closing_code(code))
        if next < 0 {
            return -1
        }
        index = next as usize
    }
    if closer != 0 {
        return -1
    }
    return n as i64
}

[export(case: "camelCase")]
micro is_valid(s: utf8) -> bool {
    let end: i64 = parse_group(s, 0, 0)
    return end >= 0
}

class Solution {
    micro isValid(self, s: utf8): bool {
        return is_valid(s)
    }
}

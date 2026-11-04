namespace leetcode.remove_all_occurrences_of_a_substring;

using std.collection;
using std.text;

# 字符栈：每压入一个字符就检查栈尾是否等于 `part`，命中则整段弹出。
[export(case: "camelCase")]
micro remove_occurrences(s: utf8, part: utf8) -> utf8 {
    let length_part: usize = part.length()
    let mut stack: ArrayList<char> = ArrayList::new(s.length())
    let mut index: usize = 0
    while index < s.length() {
        stack.push(s⁅index⁆)
        if stack.length() >= length_part {
            let mut matched: bool = true
            let mut offset: usize = 0
            while offset < length_part && matched {
                if stack⁅stack.length() - length_part + offset⁆ as u32 != part⁅offset⁆ as u32 {
                    matched = false
                }
                offset = offset + 1
            }
            if matched {
                let mut drop: usize = 0
                while drop < length_part {
                    stack.pop()
                    drop = drop + 1
                }
            }
        }
        index = index + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(stack.length())
    let mut cursor: usize = 0
    while cursor < stack.length() {
        builder.append(stack⁅cursor⁆)
        cursor = cursor + 1
    }
    return builder.build()
}

class Solution {
    micro removeOccurrences(self, s: utf8, part: utf8): utf8 {
        return remove_occurrences(s, part)
    }
}

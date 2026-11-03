namespace leetcode.clear_digits;

# 字符栈：遇字母压栈，遇数字弹出最近字母。
[export(case: "camelCase")]
micro clear_digits(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut stack: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        let code: u32 = c as u32
        if code >= 48 && code <= 57 {
            stack.pop()
        } else {
            stack.push(c)
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = 0
    while k < stack.length() {
        builder.append(stack⁅k⁆.unwrap())
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro clearDigits(self, s: utf8): utf8 {
        return clear_digits(s)
    }
}

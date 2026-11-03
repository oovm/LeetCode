namespace leetcode.remove_all_adjacent_duplicates_in_string;

[export(case: "camelCase")]
micro remove_duplicates(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut stack: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        if stack.length() > 0 && (stack⁅stack.length() - 1⁆ as u32) == (c as u32) {
            stack.pop()
        } else {
            stack.push(c)
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = 0
    while k < stack.length() {
        builder.append(stack⁅k⁆)
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro removeDuplicates(self, s: utf8): utf8 {
        return remove_duplicates(s)
    }
}

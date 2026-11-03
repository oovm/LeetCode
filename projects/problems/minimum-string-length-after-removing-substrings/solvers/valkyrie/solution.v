namespace leetcode.minimum_string_length_after_removing_substrings;

[export(case: "camelCase")]
micro min_length(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut stack: ArrayList<u8> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: u8 = s⁅i⁆
        let code: u32 = c as u32
        let mut removed: bool = false
        let len: usize = stack.length()
        if len > 0 {
            let top: u32 = stack⁅len - 1⁆ as u32
            if (top == 65 && code == 66) || (top == 67 && code == 68) {
                stack.pop()
                removed = true
            }
        }
        if !removed {
            stack.push(c)
        }
        i = i + 1
    }
    return stack.length() as i64
}

class Solution {
    micro minLength(self, s: utf8): i64 {
        return min_length(s)
    }
}

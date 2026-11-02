namespace leetcode.backspace_string_compare;

micro next_valid(s: utf8, from: i64) -> i64 {
    let mut i: i64 = from
    let mut skip: i64 = 0
    while i >= 0 {
        let c: u32 = s⁅i as usize⁆ as u32
        if c == 35 {
            skip = skip + 1
            i = i - 1
        } else if skip > 0 {
            skip = skip - 1
            i = i - 1
        } else {
            return i
        }
    }
    return -1
}

[export(case: "camelCase")]
micro backspace_compare(s: utf8, t: utf8) -> bool {
    let mut i: i64 = s.length() as i64 - 1
    let mut j: i64 = t.length() as i64 - 1
    let mut result: bool = true
    let mut done: bool = false
    while done == false {
        let a: i64 = next_valid(s, i)
        let b: i64 = next_valid(t, j)
        if a < 0 && b < 0 {
            done = true
        } else if a < 0 || b < 0 {
            done = true
            result = false
        } else {
            let ca: u32 = s⁅a as usize⁆ as u32
            let cb: u32 = t⁅b as usize⁆ as u32
            if ca == cb {
                i = a - 1
                j = b - 1
            } else {
                done = true
                result = false
            }
        }
    }
    return result
}

class Solution {
    micro backspaceCompare(self, s: utf8, t: utf8): bool {
        return backspace_compare(s, t)
    }
}

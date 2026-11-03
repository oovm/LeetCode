namespace leetcode.replace_all_s_to_avoid_consecutive_repeating_characters;

[export(case: "camelCase")]
micro modify_string(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut chars: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        chars.push(s⁅i⁆)
        i = i + 1
    }
    i = 0
    while i < n {
        if (chars⁅i⁆ as u32) == 63 {
            let mut candidate: u32 = 97
            let mut chosen: bool = false
            while candidate <= 99 && !chosen {
                let mut ok: bool = true
                if i > 0 && (chars⁅i - 1⁆ as u32) == candidate {
                    ok = false
                }
                if i + 1 < n && (chars⁅i + 1⁆ as u32) == candidate {
                    ok = false
                }
                if ok {
                    chars⁅i⁆ = char::from(candidate)
                    chosen = true
                }
                candidate = candidate + 1
            }
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < n {
        builder.append(chars⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro modifyString(self, s: utf8): utf8 {
        return modify_string(s)
    }
}

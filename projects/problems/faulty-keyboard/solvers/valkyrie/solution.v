namespace leetcode.faulty_keyboard;

[export(case: "camelCase")]
micro final_string(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut out: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        if c as u32 == 105 {
            let mut left: usize = 0
            let mut right: usize = out.length()
            if right > 0 {
                right = right - 1
            }
            while left < right {
                let tmp: char = out⁅left⁆.unwrap()
                out⁅left⁆ = out⁅right⁆.unwrap()
                out⁅right⁆ = tmp
                left = left + 1
                right = right - 1
            }
        } else {
            out.push(c)
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < out.length() {
        builder.append(out⁅i⁆.unwrap())
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro finalString(self, s: utf8): utf8 {
        return final_string(s)
    }
}

namespace leetcode.reformat_the_string;

micro is_digit_code(code: u32) -> bool {
    return code >= 48 && code <= 57
}

[export(case: "camelCase")]
micro reformat(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut letters: ArrayList<char> = ArrayList::new(n)
    let mut digits: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        if is_digit_code(c as u32) {
            digits.push(c)
        } else {
            letters.push(c)
        }
        i = i + 1
    }
    let ln: usize = letters.length()
    let dn: usize = digits.length()
    let mut empty: Utf8Builder = Utf8Builder::new(0)
    if ln > dn + 1 || dn > ln + 1 {
        return empty.build()
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let letters_first: bool = ln >= dn
    let mut k: usize = 0
    while k < n {
        let even: bool = k % 2 == 0
        if even == letters_first {
            builder.append(letters⁅k / 2⁆)
        } else {
            builder.append(digits⁅k / 2⁆)
        }
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro reformat(self, s: utf8): utf8 {
        return reformat(s)
    }
}

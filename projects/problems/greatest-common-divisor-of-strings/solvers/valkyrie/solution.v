namespace leetcode.greatest_common_divisor_of_strings;

micro same_text(a: utf8, b: utf8) -> bool {
    if a.length() != b.length() {
        return false
    }
    let mut i: usize = 0
    while i < a.length() {
        if (a⁅i⁆ as u32) != (b⁅i⁆ as u32) {
            return false
        }
        i = i + 1
    }
    return true
}

micro concat(a: utf8, b: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(a.length() + b.length())
    let mut i: usize = 0
    while i < a.length() {
        builder.append(a⁅i⁆)
        i = i + 1
    }
    i = 0
    while i < b.length() {
        builder.append(b⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

micro gcd_of(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let t: i64 = x % y
        x = y
        y = t
    }
    return x
}

# 两串拼接交换律成立时，最短公共重复单元长度等于两串长度的 gcd。
[export(case: "camelCase")]
micro gcd_of_strings(str1: utf8, str2: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    if !same_text(concat(str1, str2), concat(str2, str1)) {
        return builder.build()
    }
    let g: usize = gcd_of(str1.length() as i64, str2.length() as i64) as usize
    let mut out: Utf8Builder = Utf8Builder::new(g)
    let mut i: usize = 0
    while i < g {
        out.append(str1⁅i⁆)
        i = i + 1
    }
    return out.build()
}

class Solution {
    micro gcdOfStrings(self, str1: utf8, str2: utf8): utf8 {
        return gcd_of_strings(str1, str2)
    }
}

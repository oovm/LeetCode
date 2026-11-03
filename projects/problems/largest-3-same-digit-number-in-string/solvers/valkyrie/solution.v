namespace leetcode.largest_3_same_digit_number_in_string;

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

[export(case: "camelCase")]
micro largest_good_integer(num: utf8) -> utf8 {
    let n: usize = num.length()
    let mut best: i64 = -1
    let mut i: usize = 0
    while i + 2 < n {
        let a: u32 = num⁅i⁆ as u32
        let b: u32 = num⁅i + 1⁆ as u32
        let c: u32 = num⁅i + 2⁆ as u32
        if (a == b) && (b == c) {
            let d: i64 = a as i64 - 48
            if d > best {
                best = d
            }
        }
        i = i + 1
    }
    if best < 0 {
        return empty_text()
    }
    let mut builder: Utf8Builder = Utf8Builder::new(3)
    builder.append(char::from((48 + best) as u32))
    builder.append(char::from((48 + best) as u32))
    builder.append(char::from((48 + best) as u32))
    return builder.build()
}

class Solution {
    micro largestGoodInteger(self, num: utf8): utf8 {
        return largest_good_integer(num)
    }
}

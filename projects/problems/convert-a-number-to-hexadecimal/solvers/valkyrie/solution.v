namespace leetcode.convert_a_number_to_hexadecimal;

micro hex_digit(d: i64) -> char {
    if d < 10 {
        return char::from((48 + d) as u32)
    }
    return char::from((87 + d) as u32)
}

[export(case: "camelCase")]
micro to_hex(num: i64) -> utf8 {
    if num == 0 {
        let mut zero: Utf8Builder = Utf8Builder::new(1)
        zero.append(char::from(48))
        return zero.build()
    }
    let mut value: i64 = num
    if value < 0 {
        value = value + 4294967296
    }
    let mut builder: Utf8Builder = Utf8Builder::new(8)
    let mut digits: ArrayList<i64> = ArrayList::new(8)
    while value > 0 {
        digits.push(value % 16)
        value = value / 16
    }
    let mut i: usize = digits.length()
    while i > 0 {
        i = i - 1
        builder.append(hex_digit(digits⁅i⁆))
    }
    return builder.build()
}

class Solution {
    micro toHex(self, num: i64): utf8 {
        return to_hex(num)
    }
}

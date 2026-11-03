namespace leetcode.convert_date_to_binary;

micro digit_at(s: utf8, at: usize) -> i64 {
    return s⁅at⁆ as u32 as i64 - 48
}

micro number_from(s: utf8, start: usize, count: usize) -> i64 {
    let mut value: i64 = 0
    let mut i: usize = 0
    while i < count {
        value = value * 10 + digit_at(s, start + i)
        i = i + 1
    }
    return value
}

micro binary_of(value: i64) -> utf8 {
    let mut bits: ArrayList<i64> = ArrayList::new(24)
    let mut remaining: i64 = value
    if remaining == 0 {
        bits.push(0)
    }
    while remaining > 0 {
        bits.push(remaining % 2)
        remaining = remaining / 2
    }
    let mut builder: Utf8Builder = Utf8Builder::new(bits.length())
    let mut i: usize = bits.length()
    while i > 0 {
        i = i - 1
        builder.append(char::from((bits⁅i⁆.unwrap() + 48) as u32))
    }
    return builder.build()
}

# 按 yyyy-mm-dd 固定位切分，各段转二进制后以短横连接。
[export(case: "camelCase")]
micro convert_date_to_binary(date: utf8) -> utf8 {
    let year: i64 = number_from(date, 0, 4)
    let month: i64 = number_from(date, 5, 2)
    let day: i64 = number_from(date, 8, 2)
    let mut builder: Utf8Builder = Utf8Builder::new(32)
    builder.append(binary_of(year))
    builder.append(char::from(45))
    builder.append(binary_of(month))
    builder.append(char::from(45))
    builder.append(binary_of(day))
    return builder.build()
}

class Solution {
    micro convertDateToBinary(self, date: utf8): utf8 {
        return convert_date_to_binary(date)
    }
}

namespace leetcode.reformat_date;

micro month_number(code0: u32, code1: u32, code2: u32) -> i64 {
    if code0 == 74 && code1 == 97 && code2 == 110 {
        return 1
    }
    if code0 == 70 && code1 == 101 && code2 == 98 {
        return 2
    }
    if code0 == 77 && code1 == 97 && code2 == 114 {
        return 3
    }
    if code0 == 65 && code1 == 112 && code2 == 114 {
        return 4
    }
    if code0 == 77 && code1 == 97 && code2 == 121 {
        return 5
    }
    if code0 == 74 && code1 == 117 && code2 == 110 {
        return 6
    }
    if code0 == 74 && code1 == 117 && code2 == 108 {
        return 7
    }
    if code0 == 65 && code1 == 117 && code2 == 103 {
        return 8
    }
    if code0 == 83 && code1 == 101 && code2 == 112 {
        return 9
    }
    if code0 == 79 && code1 == 99 && code2 == 116 {
        return 10
    }
    if code0 == 78 && code1 == 111 && code2 == 118 {
        return 11
    }
    return 12
}

[export(case: "camelCase")]
micro reformat_date(date: utf8) -> utf8 {
    let n: usize = date.length()
    let mut first_space: usize = 0
    while first_space < n && (date⁅first_space⁆ as u32) != 32 {
        first_space = first_space + 1
    }
    let mut second_space: usize = first_space + 1
    while second_space < n && (date⁅second_space⁆ as u32) != 32 {
        second_space = second_space + 1
    }
    let mut day: i64 = 0
    let mut i: usize = 0
    while i < first_space && (date⁅i⁆ as u32) >= 48 && (date⁅i⁆ as u32) <= 57 {
        day = day * 10 + (date⁅i⁆ as u32 as i64 - 48)
        i = i + 1
    }
    let month: i64 = month_number(date⁅first_space + 1⁆ as u32, date⁅first_space + 2⁆ as u32, date⁅first_space + 3⁆ as u32)
    let mut builder: Utf8Builder = Utf8Builder::new(10)
    let mut k: usize = second_space + 1
    while k < n {
        builder.append(date⁅k⁆)
        k = k + 1
    }
    builder.append(char::from(45))
    builder.append(char::from((month / 10 + 48) as u32))
    builder.append(char::from((month % 10 + 48) as u32))
    builder.append(char::from(45))
    builder.append(char::from((day / 10 + 48) as u32))
    builder.append(char::from((day % 10 + 48) as u32))
    return builder.build()
}

class Solution {
    micro reformatDate(self, date: utf8): utf8 {
        return reformat_date(date)
    }
}

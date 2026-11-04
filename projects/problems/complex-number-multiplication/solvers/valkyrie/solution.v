namespace leetcode.complex_number_multiplication;

using std.text;

# 复数形如 `a+bi`，实部与虚部都可带符号，取「虚部前的最后一个符号位」作为分隔点。
micro parse_int(text: utf8) -> i64 {
    let mut index: usize = 0
    let mut sign: i64 = 1
    let mut reading_signs: bool = true
    while index < text.length() && reading_signs {
        let code: u32 = text⁅index⁆ as u32
        if code == 43 {
            index = index + 1
        } else if code == 45 {
            sign = 0 - sign
            index = index + 1
        } else {
            reading_signs = false
        }
    }
    let mut value: i64 = 0
    while index < text.length() {
        value = value * 10 + (text⁅index⁆ as u32 as i64 - 48)
        index = index + 1
    }
    return sign * value
}

# 从下标 1 起找实部之后的 `+` / `-`，命中即虚部分界。
micro split_index(num: utf8) -> usize {
    let last: usize = num.length() - 1
    let mut index: usize = 1
    while index < last {
        let code: u32 = num⁅index⁆ as u32
        if code == 43 || code == 45 {
            return index
        }
        index = index + 1
    }
    return last
}

micro real_part_of(num: utf8) -> i64 {
    let split: usize = split_index(num)
    return parse_int(num.slice(0, split))
}

micro imaginary_part_of(num: utf8) -> i64 {
    let split: usize = split_index(num)
    return parse_int(num.slice(split, num.length() - 1 - split))
}

[export(case: "camelCase")]
micro complex_number_multiply(num1: utf8, num2: utf8) -> utf8 {
    let a: i64 = real_part_of(num1)
    let b: i64 = imaginary_part_of(num1)
    let c: i64 = real_part_of(num2)
    let d: i64 = imaginary_part_of(num2)

    let real: i64 = a * c - b * d
    let imaginary: i64 = a * d + b * c

    let mut builder: Utf8Builder = Utf8Builder::new(32)
    if real < 0 {
        builder.append("-")
        builder.append_i64(0 - real)
    } else {
        builder.append_i64(real)
    }
    builder.append("+")
    if imaginary < 0 {
        builder.append("-")
        builder.append_i64(0 - imaginary)
    } else {
        builder.append_i64(imaginary)
    }
    builder.append("i")
    return builder.build()
}

class Solution {
    micro complexNumberMultiply(self, num1: utf8, num2: utf8): utf8 {
        return complex_number_multiply(num1, num2)
    }
}

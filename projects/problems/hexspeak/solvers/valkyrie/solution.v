namespace leetcode.hexspeak;

micro to_digits(num: utf8) -> ArrayList<i64> {
    let mut digits: ArrayList<i64> = ArrayList::new(num.length())
    let mut i: usize = 0
    while i < num.length() {
        digits.push(num⁅i⁆ as u32 as i64 - 48)
        i = i + 1
    }
    return digits
}

micro all_zero(digits: ArrayList<i64>) -> bool {
    let mut i: usize = 0
    while i < digits.length() {
        if digits⁅i⁆ != 0 {
            return false
        }
        i = i + 1
    }
    return true
}

# 十进制长除取十六进制余数，逐位保留最低位起的十六进制数字。
micro divide_by_16(digits: ArrayList<i64>) -> i64 {
    let mut rem: i64 = 0
    let mut i: usize = 0
    while i < digits.length() {
        let cur: i64 = rem * 10 + digits⁅i⁆
        digits⁅i⁆ = cur / 16
        rem = cur % 16
        i = i + 1
    }
    return rem
}

[export(case: "camelCase")]
micro to_hexspeak(num: utf8) -> utf8 {
    let digits: ArrayList<i64> = to_digits(num)
    let mut hex: ArrayList<i64> = ArrayList::new(0)
    while !all_zero(digits) {
        hex.push(divide_by_16(digits))
    }
    if hex.length() == 0 {
        hex.push(0)
    }
    let mut builder: Utf8Builder = Utf8Builder::new(hex.length())
    let mut i: usize = hex.length()
    while i > 0 {
        let d: i64 = hex⁅i - 1⁆
        if d == 0 {
            builder.append(char::from(79))
        } else if d == 1 {
            builder.append(char::from(73))
        } else if d >= 10 {
            builder.append(char::from((d + 55) as u32))
        } else {
            let mut out: Utf8Builder = Utf8Builder::new(5)
            out.append(char::from(69))
            out.append(char::from(82))
            out.append(char::from(82))
            out.append(char::from(79))
            out.append(char::from(82))
            return out.build()
        }
        i = i - 1
    }
    return builder.build()
}

class Solution {
    micro toHexspeak(self, num: utf8): utf8 {
        return to_hexspeak(num)
    }
}

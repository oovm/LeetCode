namespace leetcode.restore_ip_addresses;

using std.collection;

micro is_segment(digits: ArrayList<i64>, start: usize, length: usize) -> bool {
    if length == 0 {
        return false
    }
    if length > 1 && digits⁅start⁆ == 48 {
        return false
    }
    let mut value: i64 = 0
    let mut offset: usize = 0
    while offset < length {
        value = value * 10 + (digits⁅start + offset⁆ - 48)
        offset = offset + 1
    }
    return value <= 255
}

# 四段枚举，每段 1–3 位且数值不超过 255；候选先收集字节码，再一次性交给
# `Utf8Builder` 逐字符 append（压多次 append 的产出形态）。
# 题内触发点: `Utf8Builder` —— 11 次 `append(char)` 后才 `build()`。
# 题内触发点: G5 —— `ArrayList::new(4)` 预分配后按段数逐次 `push`。
[export(case: "camelCase")]
micro restore_ip_addresses(s: utf8) -> [utf8] {
    let total: usize = s.byte_length()
    let mut result: ArrayList<utf8> = ArrayList::new(4)
    if total < 4 || total > 12 {
        return result.to_array()
    }

    let mut digits: ArrayList<i64> = ArrayList::new(total)
    let mut index: usize = 0
    while index < total {
        digits.push(s.byte_at(index) as i64)
        index = index + 1
    }

    let mut first: usize = 1
    while first <= 3 {
        let mut second: usize = 1
        while second <= 3 {
            let mut third: usize = 1
            while third <= 3 {
                if first + second + third < total {
                    let fourth: usize = total - first - second - third
                    if fourth <= 3 {
                        if is_segment(digits, 0, first) {
                            if is_segment(digits, first, second) {
                                if is_segment(digits, first + second, third) {
                                    if is_segment(digits, first + second + third, fourth) {
                                        let mut codes: ArrayList<i64> = ArrayList::new(total + 3)
                                        let mut cursor: usize = 0
                                        while cursor < first {
                                            codes.push(digits⁅cursor⁆)
                                            cursor = cursor + 1
                                        }
                                        codes.push(46)
                                        while cursor < first + second {
                                            codes.push(digits⁅cursor⁆)
                                            cursor = cursor + 1
                                        }
                                        codes.push(46)
                                        while cursor < first + second + third {
                                            codes.push(digits⁅cursor⁆)
                                            cursor = cursor + 1
                                        }
                                        codes.push(46)
                                        while cursor < total {
                                            codes.push(digits⁅cursor⁆)
                                            cursor = cursor + 1
                                        }

                                        let mut builder: Utf8Builder = Utf8Builder::new(codes.length())
                                        loop code in codes {
                                            builder.append(char::from(code as u32))
                                        }
                                        result.push(builder.build())
                                    }
                                }
                            }
                        }
                    }
                }
                third = third + 1
            }
            second = second + 1
        }
        first = first + 1
    }
    return result.to_array()
}

class Solution {
    micro restoreIpAddresses(self, s: utf8): [utf8] {
        return restore_ip_addresses(s)
    }
}

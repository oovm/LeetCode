namespace leetcode.largest_number;

using std.collection;

# UTF-8 字典序比较：std 的 `utf8` 虽已有 `Comparable`，但在本批 addon 上
# 直接 `compare` 的消费点尚未验证，这里以字节/码位逐位比较兜住语义。
micro compare_text(left: utf8, right: utf8) -> i32 {
    let left_length: i64 = left.length() as i64
    let right_length: i64 = right.length() as i64
    let mut index: i64 = 0
    while index < left_length && index < right_length {
        let left_code: u32 = left⁅index as usize⁆ as u32
        let right_code: u32 = right⁅index as usize⁆ as u32
        if left_code < right_code {
            return -1
        }
        if left_code > right_code {
            return 1
        }
        index = index + 1
    }
    if left_length < right_length {
        return -1
    }
    if left_length > right_length {
        return 1
    }
    return 0
}

micro concat_text(left: utf8, right: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(left.length() + right.length())
    builder.append(left)
    builder.append(right)
    return builder.build()
}

micro text_of_number(value: i64) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(12)
    builder.append_i64(value)
    return builder.build()
}

# 拼接序：`ab` 大于 `ba` 时 `a` 应排在 `b` 前面。
micro compare_joined(left: i64, right: i64) -> i32 {
    let text_left: utf8 = text_of_number(left)
    let text_right: utf8 = text_of_number(right)
    let joined_order: i32 = compare_text(concat_text(text_left, text_right), concat_text(text_right, text_left))
    if joined_order > 0 {
        return -1
    }
    if joined_order < 0 {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro largestNumber(nums: ArrayList<i64>) -> utf8 {
    let values: ArrayList<i64> = sorted_by(nums, compare_joined)
    let mut builder: Utf8Builder = Utf8Builder::new(values.length() * 4)
    loop value in values {
        builder.append_i64(value)
    }
    let joined: utf8 = builder.build()
    if joined.length() == 0 {
        return "0"
    }
    if joined⁅0⁆ as u32 == 48 {
        let mut only_zero: bool = true
        let mut index: usize = 0
        while index < joined.length() {
            if joined⁅index⁆ as u32 != 48 {
                only_zero = false
            }
            index = index + 1
        }
        if only_zero {
            return "0"
        }
    }
    return joined
}

class Solution {
    micro largestNumber(self, nums: ArrayList<i64>): utf8 {
        return largestNumber(nums)
    }
}

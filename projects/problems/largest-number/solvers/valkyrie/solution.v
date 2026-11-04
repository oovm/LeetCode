namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: 具名比较逻辑 + 内联 `micro` 闭包作为 `merge_sort` 的比较器。
micro concat_text(left: utf8, right: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(left.byte_length() + right.byte_length())
    builder.append(left)
    builder.append(right)
    return builder.build()
}

micro text_of_number(value: i64) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(12)
    builder.append_i64(value)
    return builder.build()
}

micro compare_text(left: utf8, right: utf8) -> i32 {
    let length_left: i64 = left.byte_length() as i64
    let length_right: i64 = right.byte_length() as i64
    let mut index: i64 = 0
    while index < length_left && index < length_right {
        let code_left: u8 = left.byte_at(index as usize)
        let code_right: u8 = right.byte_at(index as usize)
        if code_left < code_right {
            return 0 - 1
        }
        if code_left > code_right {
            return 1
        }
        index = index + 1
    }
    if length_left < length_right {
        return 0 - 1
    }
    if length_left > length_right {
        return 1
    }
    return 0
}

# 拼接序：`ab` 大于 `ba` 时 `a` 应排在 `b` 前面。
micro joined_order(left: i64, right: i64) -> i32 {
    let text_left: utf8 = text_of_number(left)
    let text_right: utf8 = text_of_number(right)
    return compare_text(concat_text(text_left, text_right), concat_text(text_right, text_left))
}

class Solution {
    [export(case: "largestNumber")]
    micro largestNumber(nums: ArrayList<i64>) -> utf8 {
        let values: ArrayList<i64> = ArrayList::new(nums.length())
        loop value in nums {
            values.push(value)
        }
        merge_sort(values, micro(a: i64, b: i64) -> i32 {
            return 0 - joined_order(a, b)
        })
        let mut builder: Utf8Builder = Utf8Builder::new(values.length() * 4)
        loop value in values {
            builder.append_i64(value)
        }
        let joined: utf8 = builder.build()
        if joined.byte_length() == 0 {
            return "0"
        }
        if joined.byte_at(0) == 48 {
            let mut only_zero: bool = true
            let mut index: i64 = 0
            while index < (joined.byte_length() as i64) {
                if joined.byte_at(index as usize) != 48 {
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
}

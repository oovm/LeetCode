namespace leetcode.sort_integers_by_the_number_of_1_bits;

using std.collection;

micro bit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut num: i64 = x
    while num > 0 {
        if num % 2 == 1 {
            count = count + 1
        }
        num = num / 2
    }
    return count
}

# 主键按 1 的位数升序，次键按数值升序。
micro compare_bits(left: i64, right: i64) -> i32 {
    let left_bits: i64 = bit_count(left)
    let right_bits: i64 = bit_count(right)
    if left_bits < right_bits {
        return -1
    }
    if left_bits > right_bits {
        return 1
    }
    if left < right {
        return -1
    }
    if left > right {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro sort_by_bits(arr: [i64]) -> [i64] {
    let mut values: ArrayList<i64> = ArrayList::new(arr.length())
    loop value in arr {
        values.push(value)
    }
    let ordered: ArrayList<i64> = sorted_by(values, compare_bits)
    return ordered.to_array()
}

class Solution {
    micro sortByBits(self, arr: [i64]): [i64] {
        return sort_by_bits(arr)
    }
}

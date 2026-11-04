namespace leetcode.find_numbers_with_even_number_of_digits;

using std.collection;
using std.iterator::{Iterator, IntoIterator, count};

# std.math 没有整数 `log10` / `digits` 口径，十进制位数以除十循环求，O(log10 value)。
micro digit_count(value: i64) -> i64 {
    let mut rest: i64 = value
    let mut digits: i64 = 1
    while rest >= 10 {
        rest = rest / 10
        digits = digits + 1
    }
    return digits
}

# 迭代器适配器族压测：`filter` + 终端 `count` 都在 std 里（不在缺口账本），
# 此前记为「无匹配候选」属旧观测。
[export(case: "camelCase")]
micro find_numbers(nums: [i64]) -> i64 {
    return nums.into_iterator().filter(micro(value: i64) -> bool {
        return digit_count(value) % 2 == 0
    }).count() as i64
}

class Solution {
    micro findNumbers(self, nums: [i64]): i64 {
        return find_numbers(nums)
    }
}

namespace leetcode.missing_number_in_arithmetic_progression

# 等差数列若完整应有 n + 1 项，首末项决定总和 (首 + 末) * (n + 1) / 2，
# 与实际和的差即缺失项。除法按向下取整处理负分子，与参考解一致。
[export(case: "camelCase")]
micro missingNumber(arr: ArrayList<i64>) -> i64 {
    let count: usize = arr.length()
    let zero: usize = 0
    let last: usize = count - 1
    let first: i64 = arr⁅zero⁆
    let tail: i64 = arr⁅last⁆
    let mut sum: i64 = 0
    let mut i: usize = 0
    while i < count {
        sum = sum + arr⁅i⁆
        i = i + 1
    }
    let terms: i64 = (count + 1) as i64
    let numerator: i64 = (first + tail) * terms
    let mut complete: i64 = numerator / 2
    if numerator < 0 && numerator % 2 != 0 {
        complete = complete - 1
    }
    return complete - sum
}

class Solution {
    micro missingNumber(self, arr: ArrayList<i64>): i64 {
        return missingNumber(arr)
    }
}

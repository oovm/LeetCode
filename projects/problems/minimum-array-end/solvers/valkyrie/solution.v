namespace leetcode.minimum_array_end;

# 把 n-1 的二进制位按序填进 x 的零位（各位保留 x 的 1）。
[export(case: "camelCase")]
micro min_end(n: i64, x: i64) -> i64 {
    let mut result: i64 = x
    let mut fill: i64 = n - 1
    let mut bit: i64 = 1
    while fill > 0 {
        if result / bit % 2 == 0 {
            if fill % 2 == 1 {
                result = result + bit
            }
            fill = fill / 2
        }
        bit = bit * 2
    }
    return result
}

class Solution {
    micro minEnd(self, n: i64, x: i64): i64 {
        return min_end(n, x)
    }
}

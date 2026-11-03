namespace leetcode.concatenation_of_consecutive_binary_numbers;

# 流式拼接：value = (value · 2^{len(i)} + i) mod M；i 为 2 的幂时位数进一。
[export(case: "camelCase")]
micro concatenated_binary(n: i64) -> i64 {
    let mut value: i64 = 0
    let mut shift: i64 = 2
    let mut i: i64 = 1
    while i <= n {
        if i > 1 && i.bit_and(i - 1) == 0 {
            shift = shift * 2 % 1000000007
        }
        value = (value * shift + i) % 1000000007
        i = i + 1
    }
    return value
}

class Solution {
    micro concatenatedBinary(self, n: i64): i64 {
        return concatenated_binary(n)
    }
}

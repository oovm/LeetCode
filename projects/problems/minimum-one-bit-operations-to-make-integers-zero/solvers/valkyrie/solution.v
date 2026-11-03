namespace leetcode.minimum_one_bit_operations_to_make_integers_zero;

# 答案是把 n 当格雷码译回二进制：逐位右移累计异或。
[export(case: "camelCase")]
micro minimum_one_bit_operations(n: i64) -> i64 {
    let mut result: i64 = 0
    let mut rest: i64 = n
    while rest > 0 {
        result = result.bit_xor(rest)
        rest = rest / 2
    }
    return result
}

class Solution {
    micro minimumOneBitOperations(self, n: i64): i64 {
        return minimum_one_bit_operations(n)
    }
}

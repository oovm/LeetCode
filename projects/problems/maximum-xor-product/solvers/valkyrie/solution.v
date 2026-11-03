namespace leetcode.maximum_xor_product;

micro pow2(k: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < k {
        result = result * 2
        i = i + 1
    }
    return result
}

# 高位于 n 之上固定；低 n 位逐位分配：相同位双边同涨，不同位补给当前较小者。
[export(case: "camelCase")]
micro maximum_xor_product(a: i64, b: i64, n: i64) -> i64 {
    let mask: i64 = pow2(n) - 1
    let mut cur_a: i64 = a - a.bit_and(mask)
    let mut cur_b: i64 = b - b.bit_and(mask)
    let low_a: i64 = a.bit_and(mask)
    let low_b: i64 = b.bit_and(mask)
    let mut i: i64 = n - 1
    while i >= 0 {
        let bit: i64 = pow2(i)
        let bit_a: i64 = low_a / bit % 2
        let bit_b: i64 = low_b / bit % 2
        if bit_a == bit_b {
            cur_a = cur_a + bit
            cur_b = cur_b + bit
        } else {
            if cur_a < cur_b {
                cur_a = cur_a + bit
            } else {
                cur_b = cur_b + bit
            }
        }
        i = i - 1
    }
    return cur_a % 1000000007 * (cur_b % 1000000007) % 1000000007
}

class Solution {
    micro maximumXorProduct(self, a: i64, b: i64, n: i64): i64 {
        return maximum_xor_product(a, b, n)
    }
}

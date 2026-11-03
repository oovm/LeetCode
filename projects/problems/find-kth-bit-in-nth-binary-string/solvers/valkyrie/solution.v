namespace leetcode.find_kth_bit_in_nth_binary_string;

micro pow2(k: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < k {
        result = result * 2
        i = i + 1
    }
    return result
}

# S_n = S_{n-1} + '1' + reverse(invert(S_{n-1}))，递归定位并记录翻转。
micro bit_at(n: i64, k: i64) -> i64 {
    if n == 1 {
        return 0
    }
    let len: i64 = pow2(n) - 1
    let mid: i64 = len / 2 + 1
    if k == mid {
        return 1
    }
    if k < mid {
        return bit_at(n - 1, k)
    }
    return 1 - bit_at(n - 1, len - k + 1)
}

[export(case: "camelCase")]
micro find_kth_bit(n: i64, k: i64) -> i64 {
    return bit_at(n, k)
}

class Solution {
    micro findKthBit(self, n: i64, k: i64): i64 {
        return find_kth_bit(n, k)
    }
}

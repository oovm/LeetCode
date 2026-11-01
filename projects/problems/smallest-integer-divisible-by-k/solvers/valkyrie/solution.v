namespace leetcode.smallest_integer_divisible_by_k;

[export(case: "camelCase")]
micro smallest_repunit_div_by_k(k: i64) -> i64 {
    if k % 2 == 0 || k % 5 == 0 {
        return -1
    }
    let mut remainder: i64 = 0
    let mut length: i64 = 1
    while length <= k {
        remainder = (remainder * 10 + 1) % k
        if remainder == 0 {
            return length
        }
        length = length + 1
    }
    return -1
}

class Solution {
    micro smallestRepunitDivByK(self, k: i64): i64 {
        return smallest_repunit_div_by_k(k)
    }
}

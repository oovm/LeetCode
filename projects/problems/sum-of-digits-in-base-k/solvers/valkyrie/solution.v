namespace leetcode.sum_of_digits_in_base_k;

[export(case: "camelCase")]
micro sum_base(n: i64, k: i64) -> i64 {
    let mut num: i64 = n
    let mut sum: i64 = 0
    while num > 0 {
        sum = sum + num % k
        num = num / k
    }
    return sum
}

class Solution {
    micro sumBase(self, n: i64, k: i64): i64 {
        return sum_base(n, k)
    }
}

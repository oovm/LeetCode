namespace leetcode.minimum_operations_to_make_the_integer_zero;

micro popcount(mut x: i64) -> i64 {
    let mut count: i64 = 0
    while x > 0 {
        count = count + x % 2
        x = x / 2
    }
    return count
}

# k 次操作后 num1 - k·num2 须能写成 k 个 2 的幂之和 ⟺ popcount(t) ≤ k ≤ t。
[export(case: "camelCase")]
micro make_the_integer_zero(num1: i64, num2: i64) -> i64 {
    let mut k: i64 = 1
    while k <= 60 {
        let t: i64 = num1 - k * num2
        if t >= k && popcount(t) <= k {
            return k
        }
        k = k + 1
    }
    return -1
}

class Solution {
    micro makeTheIntegerZero(self, num1: i64, num2: i64): i64 {
        return make_the_integer_zero(num1, num2)
    }
}

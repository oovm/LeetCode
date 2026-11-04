namespace leetcode.maximum_number_that_sum_of_the_prices_is_less_than_or_equal_to_k;

micro pow2(k: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < k {
        result = result * 2
        i = i + 1
    }
    return result
}

# ≤ n 中第 p 位（1 基）置 1 的个数：完整周期 + 残段。
micro count_bit(n: i64, p: i64) -> i64 {
    let cycle: i64 = pow2(p)
    let full: i64 = (n + 1) / cycle * (cycle / 2)
    let rem: i64 = (n + 1) % cycle
    let extra: i64 = rem - cycle / 2
    if extra < 0 {
        return full
    }
    return full + extra
}

micro price_sum(n: i64, x: i64) -> i64 {
    let mut total: i64 = 0
    let mut p: i64 = x
    while p <= 62 {
        total = total + count_bit(n, p)
        p = p + x
    }
    return total
}

[export(case: "camelCase")]
micro find_maximum_number(k: i64, x: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = k * pow2(x) + pow2(x)
    while price_sum(high, x) <= k {
        high = high * 2
    }
    while low < high {
        let mid: i64 = (low + high + 1) / 2
        if price_sum(mid, x) <= k {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro findMaximumNumber(self, k: i64, x: i64): i64 {
        return find_maximum_number(k, x)
    }
}

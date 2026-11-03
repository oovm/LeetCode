namespace leetcode.maximum_sized_array;

micro pow2(k: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < k {
        result = result * 2
        i = i + 1
    }
    return result
}

# j < n 中第 b 位置 1 的个数。
micro count_set(n: i64, b: i64) -> i64 {
    let cycle: i64 = pow2(b + 1)
    let full: i64 = n / cycle * (cycle / 2)
    let rem: i64 = n % cycle
    let extra: i64 = rem - cycle / 2
    if extra < 0 {
        return full
    }
    return full + extra
}

# Σ_{j,k < n} (j OR k) = Σ_b 2^b · (n² - unset(b)²)。
micro or_pair_sum(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut b: i64 = 0
    while pow2(b) <= 2 * n {
        let set: i64 = count_set(n, b)
        let unset: i64 = n - set
        total = total + pow2(b) * (n * n - unset * unset)
        b = b + 1
    }
    return total
}

micro total_sum(n: i64) -> i64 {
    return n * (n - 1) / 2 * or_pair_sum(n)
}

[export(case: "camelCase")]
micro max_sized_array(s: i64) -> i64 {
    let mut n: i64 = 0
    while total_sum(n + 1) <= s {
        n = n + 1
    }
    return n
}

class Solution {
    micro maxSizedArray(self, s: i64): i64 {
        return max_sized_array(s)
    }
}

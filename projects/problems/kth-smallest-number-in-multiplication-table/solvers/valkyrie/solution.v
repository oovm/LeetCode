namespace leetcode.kth_smallest_number_in_multiplication_table;

micro min_of(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

# ≤ v 的表内条目数：Σ_i min(n, v / i)。
micro count_le(m: i64, n: i64, v: i64) -> i64 {
    let mut total: i64 = 0
    let mut i: i64 = 1
    while i <= m {
        total = total + min_of(n, v / i)
        i = i + 1
    }
    return total
}

[export(case: "camelCase")]
micro find_kth_number(m: i64, n: i64, k: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = m * n
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if count_le(m, n, mid) >= k {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro findKthNumber(self, m: i64, n: i64, k: i64): i64 {
        return find_kth_number(m, n, k)
    }
}

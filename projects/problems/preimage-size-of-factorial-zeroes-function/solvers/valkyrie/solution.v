namespace leetcode.preimage_size_of_factorial_zeroes_function;

# 阶乘尾零数：z(x) = Σ x/5^i。
micro zeros(x: i64) -> i64 {
    let mut total: i64 = 0
    let mut d: i64 = 5
    while d <= x {
        total = total + x / d
        d = d * 5
    }
    return total
}

micro exists_zero_count(k: i64) -> bool {
    let mut low: i64 = 0
    let mut high: i64 = 5 * (k + 1)
    while low <= high {
        let mid: i64 = low + (high - low) / 2
        let z: i64 = zeros(mid)
        if z == k {
            return true
        }
        if z < k {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return false
}

# 命中即 5 个原像，否则 0。
[export(case: "camelCase")]
micro preimage_size_fzf(k: i64) -> i64 {
    if exists_zero_count(k) {
        return 5
    }
    return 0
}

class Solution {
    micro preimageSizeFZF(self, k: i64): i64 {
        return preimage_size_fzf(k)
    }
}

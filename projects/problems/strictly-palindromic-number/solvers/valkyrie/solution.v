namespace leetcode.strictly_palindromic_number;

# 定义直查：对每个基数 b ∈ [2, n-2]，n 的 b 进制表示须回文。
# 首尾数字先行比较（多数基数首比即败），再做对称位全查。
micro highest_place_base(x: i64, b: i64) -> i64 {
    let mut place: i64 = 1
    while place * b <= x {
        place = place * b
    }
    return place
}

micro is_palindrome_in_base(x: i64, b: i64) -> bool {
    let mut high: i64 = highest_place_base(x, b)
    let mut low: i64 = 1
    while high > low {
        if (x / high) % b != (x / low) % b {
            return false
        }
        high = high / b
        low = low * b
    }
    return true
}

[export(case: "camelCase")]
micro is_strictly_palindromic(n: i64) -> bool {
    let mut b: i64 = 2
    while b <= n - 2 {
        if !is_palindrome_in_base(n, b) {
            return false
        }
        b = b + 1
    }
    return true
}

class Solution {
    micro isStrictlyPalindromic(self, n: i64): bool {
        return is_strictly_palindromic(n)
    }
}

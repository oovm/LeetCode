namespace leetcode.check_if_the_number_is_fascinating;

micro digit_at(x: i64, p: i64) -> i64 {
    let mut place: i64 = 1
    let mut i: i64 = 0
    while i < p {
        place = place * 10
        i = i + 1
    }
    return (x / place) % 10
}

[export(case: "camelCase")]
micro is_fascinating(n: i64) -> bool {
    # 拼接必须恰为 9 位：3n 仍是三位数 ⟺ n ≤ 333。
    if n > 333 {
        return false
    }
    let joined: i64 = n * 1000000 + 2 * n * 1000 + 3 * n
    let mut i: i64 = 0
    while i < 9 {
        if digit_at(joined, i) == 0 {
            return false
        }
        let mut j: i64 = i + 1
        while j < 9 {
            if digit_at(joined, i) == digit_at(joined, j) {
                return false
            }
            j = j + 1
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isFascinating(self, n: i64): bool {
        return is_fascinating(n)
    }
}

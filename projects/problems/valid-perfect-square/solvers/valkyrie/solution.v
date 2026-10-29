namespace leetcode.valid_perfect_square;

[export(case: "camelCase")]
micro is_perfect_square(num: i64) -> bool {
    if num < 1 {
        return false
    }
    let mut x: i64 = num
    let mut y: i64 = num / 2 + 1
    while y < x {
        x = y
        y = (x + num / x) / 2
    }
    return x * x == num
}

class Solution {
    micro isPerfectSquare(self, num: i64): bool {
        return is_perfect_square(num)
    }
}

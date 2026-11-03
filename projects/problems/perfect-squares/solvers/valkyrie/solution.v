namespace leetcode.perfect_squares;

micro is_perfect_square(x: i64) -> bool {
    let mut r: i64 = 0
    while r * r < x {
        r = r + 1
    }
    return r * r == x
}

# Lagrange 四平方定理 + Legendre 三平方定理 + 平方和定理：答案只在 1/2/3/4。
[export(case: "camelCase")]
micro num_squares(n: i64) -> i64 {
    if is_perfect_square(n) {
        return 1
    }
    # n = 4^a(8b+7) ⟺ 答案 4。
    let mut m: i64 = n
    while m % 4 == 0 {
        m = m / 4
    }
    if m % 8 == 7 {
        return 4
    }
    # 存在 a 使 n - a² 为完全平方 ⟺ 答案 2。
    let mut a: i64 = 0
    while a * a <= n {
        if is_perfect_square(n - a * a) {
            return 2
        }
        a = a + 1
    }
    return 3
}

class Solution {
    micro numSquares(self, n: i64): i64 {
        return num_squares(n)
    }
}

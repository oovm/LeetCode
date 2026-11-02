namespace leetcode.n_queens_ii;

# 位掩码回溯。V 无 bit_or/bit_not/左移：用 `a+b−(a&b)` 求位并（cols/d1/d2 在皇后列上重叠，
# 不能简单相加）；`mask 异或 banned` 代位内取反；`*2`/`/2` 代左右移。
micro bitor(a: i64, b: i64) -> i64 {
    return a + b - a.bit_and(b)
}

micro solve(row: i64, cols: i64, d1: i64, d2: i64, n: i64, mask: i64) -> i64 {
    if row == n {
        return 1
    }
    let banned: i64 = bitor(bitor(cols, d1), d2).bit_and(mask)
    let mut avail: i64 = mask.bit_xor(banned)
    let mut count: i64 = 0
    while avail > 0 {
        let bit: i64 = avail.bit_and(-avail)
        avail = avail - bit
        count = count + solve(row + 1, cols + bit, (d1 + bit) * 2, (d2 + bit) / 2, n, mask)
    }
    return count
}

[export(case: "camelCase")]
micro total_n_queens(n: i64) -> i64 {
    let mut mask: i64 = 1
    let mut i: i64 = 0
    while i < n {
        mask = mask * 2
        i = i + 1
    }
    mask = mask - 1
    return solve(0, 0, 0, 0, n, mask)
}

class Solution {
    micro totalNQueens(self, n: i64): i64 {
        return total_n_queens(n)
    }
}

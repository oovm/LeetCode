namespace leetcode.rotated_digits;

micro is_good(x: i64) -> bool {
    let mut has_change: bool = false
    let mut v: i64 = x
    while v > 0 {
        let d: i64 = v % 10
        if d == 3 || d == 4 || d == 7 {
            return false
        }
        if d == 2 || d == 5 || d == 6 || d == 9 {
            has_change = true
        }
        v = v / 10
    }
    return has_change
}

[export(case: "camelCase")]
micro rotated_digits(n: i64) -> i64 {
    let mut count: i64 = 0
    let mut i: i64 = 1
    while i <= n {
        if is_good(i) {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro rotatedDigits(self, n: i64): i64 {
        return rotated_digits(n)
    }
}

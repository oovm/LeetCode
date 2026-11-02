namespace leetcode.three_divisors;

micro is_prime(x: i64) -> bool {
    if x < 2 {
        return false
    }
    let mut d: i64 = 2
    while d * d <= x {
        if x % d == 0 {
            return false
        }
        d = d + 1
    }
    return true
}

[export(case: "camelCase")]
micro is_three(n: i64) -> bool {
    let mut r: i64 = 1
    while r * r < n {
        r = r + 1
    }
    if r * r != n {
        return false
    }
    return is_prime(r)
}

class Solution {
    micro isThree(self, n: i64): bool {
        return is_three(n)
    }
}

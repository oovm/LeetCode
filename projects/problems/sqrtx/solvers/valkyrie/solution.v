namespace leetcode.sqrtx;

[export(case: "camelCase")]
micro my_sqrt(x: i64) -> i64 {
    let mut lo: i64 = 0
    let mut hi: i64 = x
    while lo < hi {
        let mid: i64 = (lo + hi + 1) / 2
        if mid * mid <= x {
            lo = mid
        } else {
            hi = mid - 1
        }
    }
    return lo
}

class Solution {
    micro mySqrt(self, x: i64): i64 {
        return my_sqrt(x)
    }
}

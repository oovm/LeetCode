namespace leetcode.minimize_the_maximum_of_two_arrays;

micro gcd(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let t: i64 = x % y
        x = y
        y = t
    }
    return x
}

# ≤ x 的可用容量：cnt1 需不被 d1 整除、cnt2 需不被 d2 整除、合计需不被 lcm 整除的池子。
micro feasible(x: i64, d1: i64, d2: i64, l: i64, cnt1: i64, cnt2: i64) -> bool {
    return x - x / d1 >= cnt1 && x - x / d2 >= cnt2 && x - x / l >= cnt1 + cnt2
}

[export(case: "camelCase")]
micro minimize_set(divisor1: i64, divisor2: i64, uniqueCnt1: i64, uniqueCnt2: i64) -> i64 {
    let l: i64 = divisor1 / gcd(divisor1, divisor2) * divisor2
    let mut low: i64 = uniqueCnt1 + uniqueCnt2
    let mut high: i64 = 2 * (uniqueCnt1 + uniqueCnt2) * (divisor1 + divisor2)
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if feasible(mid, divisor1, divisor2, l, uniqueCnt1, uniqueCnt2) {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minimizeSet(self, divisor1: i64, divisor2: i64, uniqueCnt1: i64, uniqueCnt2: i64): i64 {
        return minimize_set(divisor1, divisor2, uniqueCnt1, uniqueCnt2)
    }
}

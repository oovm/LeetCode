namespace leetcode.sum_of_square_numbers;

micro isqrt(n: i64) -> i64 {
    let mut lo: i64 = 0
    let mut hi: i64 = n
    let mut ans: i64 = 0
    while lo <= hi {
        let mid: i64 = lo + (hi - lo) / 2
        if mid * mid <= n {
            ans = mid
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return ans
}

[export(case: "camelCase")]
micro judge_square_sum(c: i64) -> bool {
    let mut a: i64 = 0
    let mut b: i64 = isqrt(c)
    while a <= b {
        let s: i64 = a * a + b * b
        if s == c {
            return true
        }
        if s < c {
            a = a + 1
        } else {
            b = b - 1
        }
    }
    return false
}

class Solution {
    micro judgeSquareSum(self, c: i64): bool {
        return judge_square_sum(c)
    }
}

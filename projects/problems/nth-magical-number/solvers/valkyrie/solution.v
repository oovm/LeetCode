namespace leetcode.nth_magical_number;

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

[export(case: "camelCase")]
micro nth_magical_number(n: i64, a: i64, b: i64) -> i64 {
    let l: i64 = a / gcd(a, b) * b
    let mut low: i64 = a
    if b < a {
        low = b
    }
    let mut high: i64 = n * low
    while low < high {
        let mid: i64 = low + (high - low) / 2
        let count: i64 = mid / a + mid / b - mid / l
        if count >= n {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low % 1000000007
}

class Solution {
    micro nthMagicalNumber(self, n: i64, a: i64, b: i64): i64 {
        return nth_magical_number(n, a, b)
    }
}

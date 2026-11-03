namespace leetcode.non_negative_integers_without_consecutive_ones;

# 长 i 位且无连续 1 的二进制串计数（Fibonacci）。
micro fib_at(i: i64) -> i64 {
    let mut a: i64 = 1
    let mut b: i64 = 1
    let mut k: i64 = 0
    while k < i {
        let t: i64 = a + b
        a = b
        b = t
        k = k + 1
    }
    return a
}

# 高位向低位扫描：置位累加 fib(i)，连 1 即终止，扫完补 +1。
[export(case: "camelCase")]
micro find_integers(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut prev: i64 = 0
    let mut i: i64 = 31
    while i >= 0 {
        let mut place: i64 = 1
        let mut j: i64 = 0
        while j < i {
            place = place * 2
            j = j + 1
        }
        if n / place % 2 == 1 {
            total = total + fib_at(i)
            if prev == 1 {
                return total
            }
            prev = 1
        } else {
            prev = 0
        }
        i = i - 1
    }
    return total + 1
}

class Solution {
    micro findIntegers(self, n: i64): i64 {
        return find_integers(n)
    }
}

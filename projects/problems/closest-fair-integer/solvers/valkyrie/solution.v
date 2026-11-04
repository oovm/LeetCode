namespace leetcode.closest_fair_integer;

# 奇偶数位计数相等即公平。奇数位长的整数区间内没有任何公平数（公平数位长必为偶数），
# 因此按位长跳到下一个 10 的幂再上探，避免逐个数穿过整个奇数位长区间。
micro digit_count(x: i64) -> i64 {
    let mut v: i64 = x
    let mut d: i64 = 0
    while v > 0 {
        v = v / 10
        d = d + 1
    }
    return d
}

micro pow10(d: i64) -> i64 {
    let mut r: i64 = 1
    let mut i: i64 = 0
    while i < d {
        r = r * 10
        i = i + 1
    }
    return r
}

micro is_fair(x: i64) -> bool {
    let mut rest: i64 = x
    let mut evens: i64 = 0
    let mut odds: i64 = 0
    while rest > 0 {
        if rest % 10 % 2 == 0 {
            evens = evens + 1
        } else {
            odds = odds + 1
        }
        rest = rest / 10
    }
    return evens == odds
}

[export(case: "camelCase")]
micro closest_fair(n: i64) -> i64 {
    let mut x: i64 = n
    let mut found: bool = false
    while !found {
        let digits: i64 = digit_count(x)
        if digits % 2 != 0 {
            x = pow10(digits)
        } else if is_fair(x) {
            found = true
        } else {
            x = x + 1
        }
    }
    return x
}

class Solution {
    micro closestFair(self, n: i64): i64 {
        return closest_fair(n)
    }
}

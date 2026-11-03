namespace leetcode.number_of_ways_to_reach_a_position_after_exactly_k_steps;

micro mod_pow(base: i64, exp: i64) -> i64 {
    let mut result: i64 = 1
    let mut b: i64 = base % 1000000007
    let mut e: i64 = exp
    while e > 0 {
        if e % 2 == 1 {
            result = result * b % 1000000007
        }
        b = b * b % 1000000007
        e = e / 2
    }
    return result
}

# d=|差|，奇偶相符时 C(k, (k-d)/2)。
[export(case: "camelCase")]
micro number_of_ways(startPos: i64, endPos: i64, k: i64) -> i64 {
    let mut d: i64 = startPos - endPos
    if d < 0 {
        d = 0 - d
    }
    if d > k || (k - d) % 2 != 0 {
        return 0
    }
    let r: i64 = (k - d) / 2
    let mut c: i64 = 1
    let mut i: i64 = 1
    while i <= r {
        c = c * ((k - i + 1) % 1000000007) % 1000000007 * mod_pow(i, 1000000005) % 1000000007
        i = i + 1
    }
    return c
}

class Solution {
    micro numberOfWays(self, startPos: i64, endPos: i64, k: i64): i64 {
        return number_of_ways(startPos, endPos, k)
    }
}

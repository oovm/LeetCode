namespace leetcode.handshakes_that_dont_cross;

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

# 不交叉握手数 = Catalan(m)，m = numPeople/2，奇数为零。
[export(case: "camelCase")]
micro number_of_ways(num_people: i64) -> i64 {
    if num_people % 2 == 1 {
        return 0
    }
    let m: i64 = num_people / 2
    let mut c: i64 = 1
    let mut i: i64 = 1
    while i <= m {
        c = c * ((2 * m - i + 1) % 1000000007) % 1000000007 * mod_pow(i, 1000000005) % 1000000007
        i = i + 1
    }
    return c * mod_pow(m + 1, 1000000005) % 1000000007
}

class Solution {
    micro numberOfWays(self, numPeople: i64): i64 {
        return number_of_ways(numPeople)
    }
}

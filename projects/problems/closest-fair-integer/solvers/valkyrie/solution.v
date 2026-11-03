namespace leetcode.closest_fair_integer;

# 奇偶数位计数相等即公平；从 n 起逐个上探（答案间隙有界）。
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
    while !is_fair(x) {
        x = x + 1
    }
    return x
}

class Solution {
    micro closestFair(self, n: i64): i64 {
        return closest_fair(n)
    }
}

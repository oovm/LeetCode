namespace leetcode.arranging_coins;

[export(case: "camelCase")]
micro arrange_coins(n: i64) -> i64 {
    let mut k: i64 = 0
    let mut remaining: i64 = n
    while remaining > k {
        k = k + 1
        remaining = remaining - k
    }
    return k
}

class Solution {
    micro arrangeCoins(self, n: i64): i64 {
        return arrange_coins(n)
    }
}

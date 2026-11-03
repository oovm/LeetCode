namespace leetcode.water_bottles_ii;

# 模拟：空瓶够换就换，兑换率逐次 +1。
[export(case: "camelCase")]
micro max_bottles_drunk(numBottles: i64, numExchange: i64) -> i64 {
    let mut drunk: i64 = numBottles
    let mut empty: i64 = numBottles
    let mut rate: i64 = numExchange
    while empty >= rate {
        empty = empty - rate
        rate = rate + 1
        drunk = drunk + 1
        empty = empty + 1
    }
    return drunk
}

class Solution {
    micro maxBottlesDrunk(self, numBottles: i64, numExchange: i64): i64 {
        return max_bottles_drunk(numBottles, numExchange)
    }
}

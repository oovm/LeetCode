namespace leetcode.water_bottles;

[export(case: "camelCase")]
micro num_water_bottles(numBottles: i64, numExchange: i64) -> i64 {
    let mut total: i64 = numBottles
    let mut empty: i64 = numBottles
    while empty >= numExchange {
        let new_bottles: i64 = empty / numExchange
        total = total + new_bottles
        empty = empty % numExchange + new_bottles
    }
    return total
}

class Solution {
    micro numWaterBottles(self, numBottles: i64, numExchange: i64): i64 {
        return num_water_bottles(numBottles, numExchange)
    }
}

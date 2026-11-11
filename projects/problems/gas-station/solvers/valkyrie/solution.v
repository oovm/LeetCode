namespace leetcode.gas_station;

using std.collection;

# 贪心：油箱亏空即把起点推到下一站；全程总盈余非负则当前起点可行。
[export(case: "camelCase")]
micro canCompleteCircuit(gas: [i64], cost: [i64]) -> i64 {
    let mut tank: i64 = 0
    let mut start: i64 = 0
    let mut balance: i64 = 0
    let mut index: usize = 0
    while index < gas.length() {
        let delta: i64 = gas⁅index⁆ - cost⁅index⁆
        tank = tank + delta
        balance = balance + delta
        if tank < 0 {
            start = index as i64 + 1
            tank = 0
        }
        index = index + 1
    }
    if balance >= 0 {
        return start
    }
    return -1
}

class Solution {
    micro canCompleteCircuit(self, gas: [i64], cost: [i64]): i64 {
        return canCompleteCircuit(gas, cost)
    }
}

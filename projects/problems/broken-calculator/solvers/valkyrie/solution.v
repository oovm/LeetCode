namespace leetcode.broken_calculator;

# 逆向贪心：target > start 时偶数折半、奇数加一，否则只能逐次减一。
[export(case: "camelCase")]
micro broken_calc(startValue: i64, target: i64) -> i64 {
    if startValue >= target {
        return startValue - target
    }
    let mut current: i64 = target
    let mut operations: i64 = 0
    while current > startValue {
        if current % 2 == 0 {
            current = current / 2
        } else {
            current = current + 1
        }
        operations = operations + 1
    }
    return operations + startValue - current
}

class Solution {
    micro brokenCalc(self, startValue: i64, target: i64): i64 {
        return broken_calc(startValue, target)
    }
}

namespace leetcode.diet_plan_performance;

using std.collection;

# 定窗滑动：维护窗口和，窗口成形后与上下界比较计分。
[export(case: "camelCase")]
micro dietPlanPerformance(calories: [i64], k: i64, lower: i64, upper: i64) -> i64 {
    let window: usize = k as usize
    let mut points: i64 = 0
    let mut sum: i64 = 0
    let mut index: usize = 0
    while index < calories.length() {
        sum = sum + calories⁅index⁆
        if index >= window {
            sum = sum - calories⁅index - window⁆
        }
        if index + 1 >= window {
            if sum < lower {
                points = points - 1
            } else if sum > upper {
                points = points + 1
            }
        }
        index = index + 1
    }
    return points
}

class Solution {
    micro dietPlanPerformance(self, calories: [i64], k: i64, lower: i64, upper: i64): i64 {
        return dietPlanPerformance(calories, k, lower, upper)
    }
}

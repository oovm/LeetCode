namespace leetcode.average_salary_excluding_the_minimum_and_maximum_salary;

using std.collection;

# 单次扫：同时维护最小、最大与总和，去极值后除以 `n - 2`。
[export(case: "camelCase")]
micro average(salary: [i64]) -> f64 {
    let mut min: i64 = salary⁅0⁆
    let mut max: i64 = salary⁅0⁆
    let mut sum: i64 = 0
    loop value in salary {
        if value < min { min = value }
        if value > max { max = value }
        sum = sum + value
    }
    return (sum - min - max) as f64 / (salary.length() as i64 - 2) as f64
}

class Solution {
    micro average(self, salary: [i64]): f64 {
        return average(salary)
    }
}

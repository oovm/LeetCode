namespace leetcode.capacity_to_ship_packages_within_d_days;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 二分答案：运力下界是单件最大重量，上界是全量总重。
# 可行性按顺序装船，装不下就开新船。
micro days_needed(weights: ArrayList<i64>, capacity: i64) -> i64 {
    let mut days: i64 = 1
    let mut current: i64 = 0
    let mut loop_index_10: usize = 0
    while loop_index_10 < weights.length() {
        let weight: i64 = weights⁅loop_index_10⁆
            if current + weight > capacity {
                days = days + 1
                current = weight
            } else {
                current = current + weight
            }
        loop_index_10 = loop_index_10 + 1
    }
    return days
}

[export(case: "camelCase")]
micro shipWithinDays(weights: ArrayList<i64>, days: i64) -> i64 {
    let mut low: i64 = 0
    let mut high: i64 = 0
    let mut loop_index_25: usize = 0
    while loop_index_25 < weights.length() {
        let weight: i64 = weights⁅loop_index_25⁆
            if weight > low {
                low = weight
            }
            high = high + weight
        loop_index_25 = loop_index_25 + 1
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if days_needed(weights, mid) <= days {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro shipWithinDays(self, weights: ArrayList<i64>, days: i64): i64 {
        return shipWithinDays(weights, days)
    }
}

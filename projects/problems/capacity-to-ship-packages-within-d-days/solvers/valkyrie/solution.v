namespace leetcode.capacity_to_ship_packages_within_d_days;

using std.collection;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 二分答案：运力下界是单件最大重量，上界是全量总重。
# 可行性按顺序装船，装不下就开新船。
micro days_needed(weights: [i64], capacity: i64) -> i64 {
    let mut days: i64 = 1
    let mut current: i64 = 0
    loop weight in weights {
        if current + weight > capacity {
            days = days + 1
            current = weight
        } else {
            current = current + weight
        }
    }
    return days
}

[export(case: "camelCase")]
micro shipWithinDays(weights: [i64], days: i64) -> i64 {
    let mut low: i64 = 0
    let mut high: i64 = 0
    loop weight in weights {
        if weight > low {
            low = weight
        }
        high = high + weight
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
    micro shipWithinDays(self, weights: [i64], days: i64): i64 {
        return shipWithinDays(weights, days)
    }
}

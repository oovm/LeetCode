namespace leetcode.minimum_time_to_complete_trips;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 二分答案：总行程数关于时间单调递增。
# 给定时间 `t` 时，每辆车能跑 `t / time` 趟。
micro trips_in(time: ArrayList<i64>, total: i64) -> i64 {
    let mut trips: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < time.length() {
        let cost: i64 = time⁅loop_index_9⁆
            trips = trips + total / cost
        loop_index_9 = loop_index_9 + 1
    }
    return trips
}

[export(case: "camelCase")]
micro minimumTime(time: ArrayList<i64>, totalTrips: i64) -> i64 {
    let mut fastest: i64 = time⁅0⁆
    let mut loop_index_18: usize = 0
    while loop_index_18 < time.length() {
        let cost: i64 = time⁅loop_index_18⁆
            if cost < fastest {
                fastest = cost
            }
        loop_index_18 = loop_index_18 + 1
    }
    let mut low: i64 = 1
    let mut high: i64 = fastest * totalTrips
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if trips_in(time, mid) >= totalTrips {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minimumTime(self, time: ArrayList<i64>, totalTrips: i64): i64 {
        return minimumTime(time, totalTrips)
    }
}

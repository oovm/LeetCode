namespace leetcode.minimum_time_to_complete_trips;

using std.collection;

# 二分答案：总行程数关于时间单调递增。
# 给定时间 `t` 时，每辆车能跑 `t / time` 趟。
micro trips_in(time: ArrayList<i64>, total: i64) -> i64 {
    let mut trips: i64 = 0
    loop cost in time {
        trips = trips + total / cost
    }
    return trips
}

[export(case: "camelCase")]
micro minimumTime(time: ArrayList<i64>, totalTrips: i64) -> i64 {
    let mut fastest: i64 = time⁅0⁆
    loop cost in time {
        if cost < fastest {
            fastest = cost
        }
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

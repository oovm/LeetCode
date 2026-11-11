namespace leetcode.minimum_time_difference;

using std.collection;

# 分钟化 + 排序：相邻差取最小，另加首尾环回 `1440 - (末 - 首)`。
micro to_minutes(time: utf8) -> i64 {
    let hours: i64 = ((time⁅0⁆ as u32) as i64 - 48) * 10 + ((time⁅1⁆ as u32) as i64 - 48)
    let minutes: i64 = ((time⁅3⁆ as u32) as i64 - 48) * 10 + ((time⁅4⁆ as u32) as i64 - 48)
    return hours * 60 + minutes
}

[export(case: "camelCase")]
micro findMinDifference(timePoints: ArrayList<utf8>) -> i64 {
    let mut minutes: ArrayList<i64> = ArrayList::new(timePoints.length())
    loop time in timePoints {
        minutes.push(to_minutes(time))
    }
    sort(minutes)
    let mut best: i64 = 1440
    let mut i: usize = 1
    while i < minutes.length() {
        let diff: i64 = minutes⁅i⁆ - minutes⁅i - 1⁆
        if diff < best {
            best = diff
        }
        i = i + 1
    }
    let wrap: i64 = 1440 - (minutes⁅minutes.length() - 1⁆ - minutes⁅0⁆)
    if wrap < best {
        best = wrap
    }
    return best
}

class Solution {
    micro findMinDifference(self, timePoints: ArrayList<utf8>): i64 {
        return findMinDifference(timePoints)
    }
}

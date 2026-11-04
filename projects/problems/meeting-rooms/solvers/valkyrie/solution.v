namespace leetcode.meeting_rooms;

using std.collection;

micro compare_intervals(left: ArrayList<i64>, right: ArrayList<i64>) -> i32 {
    let start_left: i64 = left⁅0⁆
    let start_right: i64 = right⁅0⁆
    if start_left < start_right {
        return -1
    }
    if start_left > start_right {
        return 1
    }
    return 0
}

# 按开始时间排序后，相邻会议只要后一场开始早于前一场结束即冲突。
[export(case: "camelCase")]
micro can_attend_meetings(intervals: ArrayList<ArrayList<i64>>) -> bool {
    # 返回新序列的排序（G11）。
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(intervals, compare_intervals)
    let mut i: usize = 1
    while i < ordered.length() {
        let previous: ArrayList<i64> = ordered⁅i - 1⁆
        let current: ArrayList<i64> = ordered⁅i⁆
        if current⁅0⁆ < previous⁅1⁆ {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro canAttendMeetings(self, intervals: ArrayList<ArrayList<i64>>): bool {
        return can_attend_meetings(intervals)
    }
}

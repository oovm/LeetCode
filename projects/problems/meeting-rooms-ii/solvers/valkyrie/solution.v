namespace leetcode.meeting_rooms_ii;

using std.collection;

# 差分数组：每个会议在开始处 +1、结束处 -1，扫描前缀和取峰值即所需最少会议室。
# 与参考解的 `[0] * (max_end + 1)` 扫描完全对应。
[export(case: "camelCase")]
micro minMeetingRooms(intervals: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = intervals.length()
    if count == 0 {
        return 0
    }

    let mut latest: i64 = 0
    let mut i: usize = 0
    while i < count {
        let interval: ArrayList<i64> = intervals⁅i⁆
        let end: i64 = interval⁅1⁆
        if end > latest {
            latest = end
        }
        i = i + 1
    }

    let mut delta: ArrayList<i64> = ArrayList::new(latest as usize + 1)
    let mut slot: usize = 0
    while slot <= latest as usize {
        delta.push(0)
        slot = slot + 1
    }

    i = 0
    while i < count {
        let interval: ArrayList<i64> = intervals⁅i⁆
        let start: i64 = interval⁅0⁆
        let end: i64 = interval⁅1⁆
        delta.set((start + 1) as isize, delta⁅start as usize⁆ + 1)
        delta.set((end + 1) as isize, delta⁅end as usize⁆ - 1)
        i = i + 1
    }

    let mut rooms: i64 = 0
    let mut active: i64 = 0
    let mut t: usize = 0
    while t < delta.length() {
        active = active + delta⁅t⁆
        if active > rooms {
            rooms = active
        }
        t = t + 1
    }
    return rooms
}

class Solution {
    micro minMeetingRooms(self, intervals: ArrayList<ArrayList<i64>>): i64 {
        return minMeetingRooms(intervals)
    }
}

namespace leetcode.button_with_longest_push_time;

using std.collection;

# 相邻按下时间之差即一次按住的时长，取最长一次，相同则取按钮编号较小者。
[export(case: "camelCase")]
micro buttonWithLongestTime(events: ArrayList<ArrayList<i64>>) -> i64 {
    let mut best_id: i64 = events⁅0⁆⁅0⁆
    let mut best_time: i64 = events⁅0⁆⁅1⁆
    let mut position: usize = 1
    while position < events.length() {
        let time: i64 = events⁅position⁆⁅1⁆ - events⁅position - 1⁆⁅1⁆
        if time > best_time {
            best_time = time
            best_id = events⁅position⁆⁅0⁆
        } else if time == best_time {
            if events⁅position⁆⁅0⁆ < best_id {
                best_id = events⁅position⁆⁅0⁆
            }
        }
        position = position + 1
    }
    return best_id
}

class Solution {
    micro buttonWithLongestTime(self, events: ArrayList<ArrayList<i64>>): i64 {
        return buttonWithLongestTime(events)
    }
}

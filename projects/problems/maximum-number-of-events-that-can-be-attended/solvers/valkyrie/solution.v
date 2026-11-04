namespace leetcode.maximum_number_of_events_that_can_be_attended;

using std.collection;

# 按开始日排序（`sorted_by`，G11 提案），再用最小优先队列取最早结束的事件。
[export(case: "camelCase")]
micro maxEvents(events: ArrayList<ArrayList<i64>>) -> i64 {
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(events, micro(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
        if a⁅0⁆ < b⁅0⁆ {
            return -1
        }
        if a⁅0⁆ > b⁅0⁆ {
            return 1
        }
        return 0
    })

    let mut queue: PriorityQueue<i64> = PriorityQueue::new()
    let mut current: i64 = 0
    let mut attended: i64 = 0
    let mut index: usize = 0
    while index < ordered.length() || queue.is_empty() == false {
        if queue.is_empty() {
            let start: i64 = ordered⁅index⁆⁅0⁆
            if current < start {
                current = start
            }
        }
        while index < ordered.length() {
            let start: i64 = ordered⁅index⁆⁅0⁆
            if start > current {
                break
            }
            queue.push(ordered⁅index⁆⁅1⁆)
            index = index + 1
        }
        while queue.is_empty() == false {
            let end: i64 = queue.peek().unwrap()
            if end < current {
                queue.pop()
            } else {
                break
            }
        }
        if queue.is_empty() == false {
            queue.pop()
            attended = attended + 1
            current = current + 1
        }
    }
    return attended
}

class Solution {
    micro maxEvents(self, events: ArrayList<ArrayList<i64>>): i64 {
        return maxEvents(events)
    }
}

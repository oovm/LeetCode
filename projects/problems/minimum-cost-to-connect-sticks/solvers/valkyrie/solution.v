namespace leetcode.minimum_cost_to_connect_sticks;

using std.collection;

# 最小优先队列：每次合并最短的两根，合并代价就是新长度。
[export(case: "camelCase")]
micro connectSticks(sticks: ArrayList<i64>) -> i64 {
    let mut queue: PriorityQueue<i64> = PriorityQueue::new()
    loop value in sticks {
        queue.push(value)
    }

    let mut cost: i64 = 0
    while queue.length() > 1 {
        let first: i64 = queue.pop().unwrap()
        let second: i64 = queue.pop().unwrap()
        let merged: i64 = first + second
        cost = cost + merged
        queue.push(merged)
    }
    return cost
}

class Solution {
    micro connectSticks(self, sticks: ArrayList<i64>): i64 {
        return connectSticks(sticks)
    }
}

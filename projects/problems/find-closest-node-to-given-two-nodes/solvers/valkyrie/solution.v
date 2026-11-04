namespace leetcode.find_closest_node_to_given_two_nodes;

using std.collection;

# 先分别从两个起点沿唯一出边走，记录到每个节点的步数。
# 再扫描公共可达节点，取 `max(d1, d2)` 最小者，同值时取编号最小（从小到大扫描天然满足）。
micro distances(start: i64, edges: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = edges.length()
    let mut dist: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        dist.push(-1)
        fill = fill + 1
    }

    let mut current: i64 = start
    let mut steps: i64 = 0
    while current != -1 && dist⁅current as usize⁆ == -1 {
        dist.set((current + 1) as isize, steps)
        current = edges⁅current as usize⁆
        steps = steps + 1
    }
    return dist
}

[export(case: "camelCase")]
micro closestMeetingNode(edges: ArrayList<i64>, node1: i64, node2: i64) -> i64 {
    let from_first: ArrayList<i64> = distances(node1, edges)
    let from_second: ArrayList<i64> = distances(node2, edges)
    let count: usize = edges.length()

    let mut answer: i64 = -1
    let mut best: i64 = 1000000000000
    let mut index: usize = 0
    while index < count {
        let first: i64 = from_first⁅index⁆
        let second: i64 = from_second⁅index⁆
        if first != -1 && second != -1 {
            let current: i64 = if first > second { first } else { second }
            if current < best {
                best = current
                answer = index as i64
            }
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro closestMeetingNode(self, edges: ArrayList<i64>, node1: i64, node2: i64): i64 {
        return closestMeetingNode(edges, node1, node2)
    }
}

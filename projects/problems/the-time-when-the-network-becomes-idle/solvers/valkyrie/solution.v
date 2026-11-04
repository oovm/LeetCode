namespace leetcode.the_time_when_the_network_becomes_idle;

using std.collection;

# 从 0 号节点 BFS 求距离，每个节点重发后最后一次消息到达时间为
# ((2d-1)/patience)*patience + 2d + 1，取最大值。
[export(case: "camelCase")]
micro networkBecomesIdle(edges: ArrayList<ArrayList<i64>>, patience: ArrayList<i64>) -> i64 {
    let mut adjacency: HashMap<i64, ArrayList<i64>> = HashMap::new(edges.length() + 1)

    let mut index: usize = 0
    while index < edges.length() {
        let edge: ArrayList<i64> = edges⁅index⁆
        let from: i64 = edge⁅0⁆
        let to: i64 = edge⁅1⁆

        if adjacency.contains_key(from) == false {
            let mut fresh_from: ArrayList<i64> = ArrayList::new(0)
            adjacency.insert(from, fresh_from)
        }
        let mut from_links: ArrayList<i64> = adjacency.get(from).unwrap()
        from_links.push(to)
        adjacency.insert(from, from_links)

        if adjacency.contains_key(to) == false {
            let mut fresh_to: ArrayList<i64> = ArrayList::new(0)
            adjacency.insert(to, fresh_to)
        }
        let mut to_links: ArrayList<i64> = adjacency.get(to).unwrap()
        to_links.push(from)
        adjacency.insert(to, to_links)

        index = index + 1
    }

    let mut distance: HashMap<i64, i64> = HashMap::new(edges.length() + 1)
    distance.insert(0, 0)
    let mut order: ArrayList<i64> = ArrayList::new(edges.length() + 1)

    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)
    while queue.is_empty() == false {
        let current: i64 = queue.pop_front().unwrap()
        let links: ArrayList<i64> = adjacency.get(current).unwrap()
        let mut cursor: usize = 0
        while cursor < links.length() {
            let next: i64 = links⁅cursor⁆
            if distance.contains_key(next) == false {
                distance.insert(next, distance.get(current).unwrap() + 1)
                order.push(next)
                queue.push_back(next)
            }
            cursor = cursor + 1
        }
    }

    let mut answer: i64 = 0
    let mut node: usize = 0
    while node < order.length() {
        let target: i64 = order⁅node⁆
        let trip: i64 = distance.get(target).unwrap() * 2
        let period: i64 = patience⁅target as usize⁆
        let rounds: i64 = (trip - 1) / period
        let finish: i64 = rounds * period + trip + 1
        if finish > answer {
            answer = finish
        }
        node = node + 1
    }
    return answer
}

class Solution {
    micro networkBecomesIdle(self, edges: ArrayList<ArrayList<i64>>, patience: ArrayList<i64>): i64 {
        return networkBecomesIdle(edges, patience)
    }
}

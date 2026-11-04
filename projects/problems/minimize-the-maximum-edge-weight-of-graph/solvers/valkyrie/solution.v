namespace leetcode.minimize_the_maximum_edge_weight_of_graph;

using std.collection;

# 反向建图后对最大边权上限二分：反向图上从 0 能到达全部节点，
# 等价于原图上每个节点都能用不超过该上限的边走到 0。
micro covers_all(limit: i64, reversed: ArrayList<ArrayList<i64>>, count: usize) -> bool {
    let mut visited: ArrayList<bool> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        visited.push(false)
        fill = fill + 1
    }
    visited.set(1, true)

    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)
    let mut reached: i64 = 1

    while queue.is_empty() == false {
        let node: i64 = queue.pop_front().unwrap()
        let links: ArrayList<i64> = reversed⁅node as usize⁆
        let mut offset: usize = 0
        while offset < links.length() {
            let next: i64 = links⁅offset⁆
            let weight: i64 = links⁅offset + 1⁆
            let next_index: usize = next as usize
            if visited⁅next_index⁆ == false {
                if weight <= limit {
                    visited.set((next + 1) as isize, true)
                    reached = reached + 1
                    queue.push_back(next)
                }
            }
            offset = offset + 2
        }
    }
    return reached == count as i64
}

[export(case: "camelCase")]
micro minMaxWeight(n: i64, edges: ArrayList<ArrayList<i64>>, threshold: i64) -> i64 {
    # threshold 至少为 1 时，每个非零节点只保留一条出边即可满足出度约束。
    if threshold < 1 {
        return -1
    }

    let count: usize = n as usize
    let mut reversed: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        reversed.push(row)
        fill = fill + 1
    }

    let mut max_weight: i64 = 0
    let mut index: usize = 0
    while index < edges.length() {
        let edge: ArrayList<i64> = edges⁅index⁆
        let from: i64 = edge⁅0⁆
        let to: i64 = edge⁅1⁆
        let weight: i64 = edge⁅2⁆
        let mut links: ArrayList<i64> = reversed⁅to as usize⁆
        links.push(from)
        links.push(weight)
        reversed.set((to + 1) as isize, links)
        if weight > max_weight {
            max_weight = weight
        }
        index = index + 1
    }

    if covers_all(max_weight, reversed, count) == false {
        return -1
    }

    let mut low: i64 = 1
    let mut high: i64 = max_weight
    while low < high {
        let middle: i64 = (low + high) / 2
        if covers_all(middle, reversed, count) {
            high = middle
        } else {
            low = middle + 1
        }
    }
    return low
}

class Solution {
    micro minMaxWeight(self, n: i64, edges: ArrayList<ArrayList<i64>>, threshold: i64): i64 {
        return minMaxWeight(n, edges, threshold)
    }
}

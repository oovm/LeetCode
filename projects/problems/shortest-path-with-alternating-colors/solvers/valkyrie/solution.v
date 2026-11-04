namespace leetcode.shortest_path_with_alternating_colors;

using std.collection;

# 状态 = (节点, 进入该节点的颜色)。红色出发到蓝色边，蓝色出发到红色边。
# BFS 一次求出两类起点的最短距离，最后逐节点取较小值。
[export(case: "camelCase")]
micro shortestAlternatingPaths(n: i64, redEdges: ArrayList<ArrayList<i64>>, blueEdges: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let count: usize = n as usize
    let mut red: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut blue: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        red.push(ArrayList::new(0))
        blue.push(ArrayList::new(0))
        index = index + 1
    }

    index = 0
    while index < redEdges.length() {
        let edge: ArrayList<i64> = redEdges⁅index⁆
        let from: i64 = edge⁅0⁆
        let mut targets: ArrayList<i64> = red⁅from as usize⁆
        targets.push(edge⁅1⁆)
        red.set((from + 1) as isize, targets)
        index = index + 1
    }

    index = 0
    while index < blueEdges.length() {
        let edge: ArrayList<i64> = blueEdges⁅index⁆
        let from: i64 = edge⁅0⁆
        let mut targets: ArrayList<i64> = blue⁅from as usize⁆
        targets.push(edge⁅1⁆)
        blue.set((from + 1) as isize, targets)
        index = index + 1
    }

    let mut dist: ArrayList<i64> = ArrayList::new(count * 2)
    let mut fill: usize = 0
    while fill < count * 2 {
        dist.push(-1)
        fill = fill + 1
    }
    dist.set(1, 0)
    dist.set(2, 0)

    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)
    queue.push_back(1)

    while queue.is_empty() == false {
        let state: i64 = queue.pop_front().unwrap()
        let node: usize = state as usize / 2
        let color: usize = state as usize % 2
        let next_color: usize = 1 - color
        let targets: ArrayList<i64> = if next_color == 0 { red⁅node⁆ } else { blue⁅node⁆ }
        let mut cursor: usize = 0
        while cursor < targets.length() {
            let next: i64 = targets⁅cursor⁆
            let next_state: i64 = next * 2 + (next_color as i64)
            if dist⁅next_state as usize⁆ == -1 {
                dist.set((next_state + 1) as isize, dist⁅state as usize⁆ + 1)
                queue.push_back(next_state)
            }
            cursor = cursor + 1
        }
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: usize = 0
    while cursor < count {
        let first: i64 = dist⁅cursor * 2⁆
        let second: i64 = dist⁅cursor * 2 + 1⁆
        if first == -1 {
            result.push(second)
        } else if second == -1 {
            result.push(first)
        } else if first < second {
            result.push(first)
        } else {
            result.push(second)
        }
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro shortestAlternatingPaths(self, n: i64, redEdges: ArrayList<ArrayList<i64>>, blueEdges: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return shortestAlternatingPaths(n, redEdges, blueEdges)
    }
}

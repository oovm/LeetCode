namespace leetcode.path_with_maximum_probability;

using std.collection;

# 邻接表里每条边存 [邻居, 边下标]，概率从 `succProb` 按边下标取。
# 概率是连乘且非负，取最大概率等价于最短路，用 O(n^2) 的朴素 Dijkstra。
[export(case: "camelCase")]
micro maxProbability(n: i64, edges: ArrayList<ArrayList<i64>>, succProb: ArrayList<f64>, start_node: i64, end_node: i64) -> f64 {
    let count: usize = n as usize

    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        adjacency.push(ArrayList::new(0))
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < edges.length() {
        let edge: ArrayList<i64> = edges⁅index⁆
        let left: i64 = edge⁅0⁆
        let right: i64 = edge⁅1⁆

        let mut forward: ArrayList<i64> = adjacency⁅left as usize⁆
        forward.push(right)
        forward.push(index as i64)
        adjacency.set((left + 1) as isize, forward)

        let mut backward: ArrayList<i64> = adjacency⁅right as usize⁆
        backward.push(left)
        backward.push(index as i64)
        adjacency.set((right + 1) as isize, backward)

        index = index + 1
    }

    let mut best: ArrayList<f64> = ArrayList::new(count)
    let mut visited: ArrayList<bool> = ArrayList::new(count)
    fill = 0
    while fill < count {
        best.push(0.0)
        visited.push(false)
        fill = fill + 1
    }
    best.set((start_node + 1) as isize, 1.0)

    if start_node == end_node {
        return 1.0
    }

    let mut round: usize = 0
    while round < count {
        let mut select: i64 = -1
        let mut top: f64 = 0.0
        let mut cursor: usize = 0
        while cursor < count {
            if visited⁅cursor⁆ == false {
                let value: f64 = best⁅cursor⁆
                if select == -1 || value > top {
                    select = cursor as i64
                    top = value
                }
            }
            cursor = cursor + 1
        }
        if select == -1 {
            break
        }
        if top <= 0.0 {
            break
        }
        visited.set((select + 1) as isize, true)
        if select == end_node {
            break
        }

        let links: ArrayList<i64> = adjacency⁅select as usize⁆
        let mut offset: usize = 0
        while offset < links.length() {
            let next: i64 = links⁅offset⁆
            let edge_index: usize = links⁅offset + 1⁆ as usize
            let candidate: f64 = top * succProb⁅edge_index⁆
            if visited⁅next as usize⁆ == false && candidate > best⁅next as usize⁆ {
                best.set((next + 1) as isize, candidate)
            }
            offset = offset + 2
        }

        round = round + 1
    }

    return best⁅end_node as usize⁆
}

class Solution {
    micro maxProbability(self, n: i64, edges: ArrayList<ArrayList<i64>>, succProb: ArrayList<f64>, start_node: i64, end_node: i64): f64 {
        return maxProbability(n, edges, succProb, start_node, end_node)
    }
}

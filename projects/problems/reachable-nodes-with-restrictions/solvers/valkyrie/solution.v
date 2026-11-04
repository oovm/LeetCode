namespace leetcode.reachable_nodes_with_restrictions;

using std.collection;

# 受限节点视为不可进入，从 0 出发在无向邻接表上做显式栈 DFS 统计可达节点数。
[export(case: "camelCase")]
micro reachableNodes(n: i64, edges: ArrayList<ArrayList<i64>>, restricted: ArrayList<i64>) -> i64 {
    let count: usize = n as usize

    let mut blocked: ArrayList<bool> = ArrayList::new(count)
    let mut visited: ArrayList<bool> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        blocked.push(false)
        visited.push(false)
        fill = fill + 1
    }

    let mut i: usize = 0
    while i < restricted.length() {
        let node: i64 = restricted⁅i⁆
        blocked.set((node as usize + 1) as isize, true)
        i = i + 1
    }
    let mut graph: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    fill = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        graph.push(row)
        fill = fill + 1
    }

    i = 0
    while i < edges.length() {
        let edge: ArrayList<i64> = edges⁅i⁆
        let left: usize = edge⁅0⁆ as usize
        let right: usize = edge⁅1⁆ as usize

        let mut forward: ArrayList<i64> = graph⁅left⁆
        forward.push(right as i64)
        graph.set((left + 1) as isize, forward)

        let mut backward: ArrayList<i64> = graph⁅right⁆
        backward.push(left as i64)
        graph.set((right + 1) as isize, backward)
        i = i + 1
    }

    let mut stack: Deque<i64> = Deque::new()
    stack.push_back(0)
    visited.set(1, true)
    let mut reachable: i64 = 0
    while stack.is_empty() == false {
        let node: i64 = stack.pop_back().unwrap()
        reachable = reachable + 1
        let neighbors: ArrayList<i64> = graph⁅node as usize⁆
        let mut k: usize = 0
        while k < neighbors.length() {
            let next: i64 = neighbors⁅k⁆
            let at: usize = next as usize
            if blocked⁅at⁆ == false && visited⁅at⁆ == false {
                visited.set((at + 1) as isize, true)
                stack.push_back(next)
            }
            k = k + 1
        }
    }
    return reachable
}

class Solution {
    micro reachableNodes(self, n: i64, edges: ArrayList<ArrayList<i64>>, restricted: ArrayList<i64>): i64 {
        return reachableNodes(n, edges, restricted)
    }
}

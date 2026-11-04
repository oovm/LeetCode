namespace leetcode.is_graph_bipartite;

# 二分图判定：邻接表装进无向图（双向边），逐分量双色 BFS，邻居已取同色即冲突。
[export(case: "camelCase")]
micro is_bipartite(graph: ArrayList<ArrayList<i64>>) -> bool {
    let n: usize = graph.length()
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    let mut node: usize = 0
    while node < n {
        network.add_node(node as i64)
        let neighbours: ArrayList<i64> = graph⁅node⁆
        let mut k: usize = 0
        while k < neighbours.length() {
            network.add_edge(node as i64, neighbours⁅k⁆)
            network.add_edge(neighbours⁅k⁆, node as i64)
            k = k + 1
        }
        node = node + 1
    }

    let mut color: HashMap<i64, i64> = HashMap::new(n)
    let nodes: ArrayList<i64> = network.nodes()
    let mut i: usize = 0
    while i < nodes.length() {
        let start: i64 = nodes⁅i⁆
        if !color.contains_key(start) {
            color.insert(start, 0)
            let mut queue: ArrayList<i64> = ArrayList::new(n)
            queue.push(start)
            let mut head: usize = 0
            while head < queue.length() {
                let current: i64 = queue⁅head⁆
                head = head + 1
                let wanted: i64 = 1 - color.get(current).unwrap()
                let neighbours: ArrayList<i64> = network.successors(current)
                let mut k: usize = 0
                while k < neighbours.length() {
                    let next: i64 = neighbours⁅k⁆
                    if !color.contains_key(next) {
                        color.insert(next, wanted)
                        queue.push(next)
                    } else if color.get(next).unwrap() != wanted {
                        return false
                    }
                    k = k + 1
                }
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isBipartite(self, graph: ArrayList<ArrayList<i64>>): bool {
        return is_bipartite(graph)
    }
}

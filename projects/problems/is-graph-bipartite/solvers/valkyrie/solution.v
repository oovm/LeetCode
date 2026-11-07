namespace leetcode.is_graph_bipartite;

using std.math.graph_theory;

# 二分图判定：邻接表装进无向图（双向边），交给 std 的二色判定，冲突即不可二分。
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
            network.add_undirected_edge(node as i64, neighbours⁅k⁆)
            k = k + 1
        }
        node = node + 1
    }

    return bipartition(network).is_some()
}

class Solution {
    micro isBipartite(self, graph: ArrayList<ArrayList<i64>>): bool {
        return is_bipartite(graph)
    }
}

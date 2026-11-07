namespace leetcode.find_center_of_star_graph;

# 星形图的中心出现在每条边上，度数 ≥ 2；其余点度数恒为 1。
[export(case: "camelCase")]
micro find_center(edges: ArrayList<ArrayList<i64>>) -> i64 {
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    loop edge in edges {
        network.add_undirected_edge(edge⁅0⁆, edge⁅1⁆)
    }

    let threshold: usize = 2
    let nodes: ArrayList<i64> = network.nodes()
    let mut i: usize = 0
    while i < nodes.length() {
        let node: i64 = nodes⁅i⁆
        if network.out_degree(node) >= threshold {
            return node
        }
        i = i + 1
    }
    return -1
}

class Solution {
    micro findCenter(self, edges: ArrayList<ArrayList<i64>>): i64 {
        return find_center(edges)
    }
}

namespace leetcode.minimum_number_of_vertices_to_reach_all_nodes;

# 最小顶点集恰为全图入度为 0 的节点（升序输出）。
[export(case: "camelCase")]
micro find_smallest_set_of_vertices(n: i64, edges: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    let mut node: i64 = 0
    while node < n {
        network.add_node(node)
        node = node + 1
    }

    loop edge in edges {
        network.add_edge(edge⁅0⁆, edge⁅1⁆)
    }

    let mut result: ArrayList<i64> = ArrayList::new(0)
    node = 0
    while node < n {
        if network.in_degree(node) == 0 {
            result.push(node)
        }
        node = node + 1
    }
    return result
}

class Solution {
    micro findSmallestSetOfVertices(self, n: i64, edges: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return find_smallest_set_of_vertices(n, edges)
    }
}

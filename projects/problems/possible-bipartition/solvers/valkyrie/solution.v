namespace leetcode.solution

using std.collection
using std.math.graph_theory

# 二色着色：把「讨厌」看成无向边，交给 std 的 `bipartition`；任一条边两端同色即不可二分。
# std 的 graph 模块已提供 `bipartition`（G9 已恢复），题内不再手写 BFS 染色。
class Solution {
    [export(case: "camelCase")]
    micro possibleBipartition(n: i64, dislikes: ArrayList<ArrayList<i64>>) -> bool {
        let mut graph: DirectedGraph<i64> = DirectedGraph::new()
        let mut person: i64 = 1
        while person <= n {
            graph.add_node(person)
            person = person + 1
        }
        loop pair in dislikes {
            let first: i64 = pair⁅0⁆
            let second: i64 = pair⁅1⁆
            graph.add_node(first)
            graph.add_node(second)
            graph.add_edge(first, second)
            graph.add_edge(second, first)
        }
        return bipartition(graph).is_some()
    }
}

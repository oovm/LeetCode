namespace probe.topological_sort;

using std.collection

# Kahn 拓扑排序：邻接表 + 入度表，零入度队列用数组加游标充当 FIFO。
structure Graph {
    adjacency: ArrayList<ArrayList<i64>>
    indegree: ArrayList<i64>
}

micro graph_new(nodes: i64) -> Graph {
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(nodes as usize)
    let mut indegree: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        let mut row: ArrayList<i64> = ArrayList::new(2)
        adjacency.push(row)
        indegree.push(0)
        index = index + 1
    }
    return Graph { adjacency: adjacency, indegree: indegree }
}

micro add_edge(mut graph: Graph, from: i64, to: i64) -> unit {
    graph.adjacency⁅from as usize⁆.push(to)
    graph.indegree.set_cardinal(to as usize, graph.indegree⁅to as usize⁆ + 1)
}

micro kahn(mut graph: Graph, nodes: i64) -> ArrayList<i64> {
    let mut order: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut queue: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        if graph.indegree⁅index as usize⁆ == 0 {
            queue.push(index)
        }
        index = index + 1
    }
    let mut head: i64 = 0
    while head < queue.length() as i64 {
        let node: i64 = queue⁅head as usize⁆
        head = head + 1
        order.push(node)
        loop next in graph.adjacency⁅node as usize⁆ {
            graph.indegree.set_cardinal(next as usize, graph.indegree⁅next as usize⁆ - 1)
            if graph.indegree⁅next as usize⁆ == 0 {
                queue.push(next)
            }
        }
    }
    return order
}

# 六节点：0 -> 1 -> 3 -> 4，0 -> 2 -> 3，节点 5 孤立。队列入队顺序决定编码。
[export(name: "topologicalOrderCode")]
micro topological_order_code() -> i64 {
    let mut graph: Graph = graph_new(6)
    add_edge(graph, 0, 1)
    add_edge(graph, 0, 2)
    add_edge(graph, 1, 3)
    add_edge(graph, 2, 3)
    add_edge(graph, 3, 4)
    let mut checksum: i64 = 0
    loop node in kahn(graph, 6) {
        checksum = checksum * 10 + node
    }
    return checksum
}

# 有环时 Kahn 无法纳入全部节点，必须可观察地返回 -1。
[export(name: "topologicalCycleDetected")]
micro topological_cycle_detected() -> i64 {
    let mut graph: Graph = graph_new(3)
    add_edge(graph, 0, 1)
    add_edge(graph, 1, 2)
    add_edge(graph, 2, 0)
    if kahn(graph, 3).length() as i64 != 3 {
        return -1
    }
    return 0
}

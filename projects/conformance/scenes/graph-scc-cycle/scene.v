namespace probe.graph_scc_cycle;

using std.collection

# 有向图：正向与反向邻接表同构承载，供 Kosaraju 两遍扫描。
structure Digraph {
    adjacency: ArrayList<ArrayList<i64>>
    reverse: ArrayList<ArrayList<i64>>
}

micro digraph_new(nodes: i64) -> Digraph {
    let mut adjacency: ArrayList<ArrayList<i64>> = ArrayList::new(nodes as usize)
    let mut mirror: ArrayList<ArrayList<i64>> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        let mut forward_row: ArrayList<i64> = ArrayList::new(2)
        let mut reverse_row: ArrayList<i64> = ArrayList::new(2)
        adjacency.push(forward_row)
        mirror.push(reverse_row)
        index = index + 1
    }
    return Digraph { adjacency: adjacency, reverse: mirror }
}

micro add_edge(mut graph: Digraph, from: i64, to: i64) -> unit {
    graph.adjacency⁅from as usize⁆.push(to)
    graph.reverse⁅to as usize⁆.push(from)
}

# 第一遍：按完成时刻把节点压栈。
micro dfs_finish(graph: Digraph, node: i64, mut visited: ArrayList<i64>, mut order: ArrayList<i64>) -> unit {
    visited.set_cardinal(node as usize, 1)
    loop next in graph.adjacency⁅node as usize⁆ {
        if visited⁅next as usize⁆ == 0 {
            dfs_finish(graph, next, visited, order)
        }
    }
    order.push(node)
}

# 第二遍：在反向图里从栈顶扩散，一次扩散即一个强连通分量。
micro dfs_assign(graph: Digraph, node: i64, mut assigned: ArrayList<i64>) -> unit {
    assigned.set_cardinal(node as usize, 1)
    loop previous in graph.reverse⁅node as usize⁆ {
        if assigned⁅previous as usize⁆ == 0 {
            dfs_assign(graph, previous, assigned)
        }
    }
}

micro count_scc(graph: Digraph, nodes: i64) -> i64 {
    let mut visited: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut order: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        visited.push(0)
        index = index + 1
    }
    index = 0
    while index < nodes {
        if visited⁅index as usize⁆ == 0 {
            dfs_finish(graph, index, visited, order)
        }
        index = index + 1
    }
    let mut assigned: ArrayList<i64> = ArrayList::new(nodes as usize)
    index = 0
    while index < nodes {
        assigned.push(0)
        index = index + 1
    }
    let mut components: i64 = 0
    let mut cursor: i64 = order.length() as i64 - 1
    while cursor >= 0 {
        let node: i64 = order⁅cursor as usize⁆
        if assigned⁅node as usize⁆ == 0 {
            components = components + 1
            dfs_assign(graph, node, assigned)
        }
        cursor = cursor - 1
    }
    return components
}

# Kahn 只统计能被拓扑消去的节点数，剩余节点即处在环上。
micro kahn_removed(graph: Digraph, nodes: i64) -> i64 {
    let mut indegree: ArrayList<i64> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        indegree.push(0)
        index = index + 1
    }
    index = 0
    while index < nodes {
        loop next in graph.adjacency⁅index as usize⁆ {
            indegree.set_cardinal(next as usize, indegree⁅next as usize⁆ + 1)
        }
        index = index + 1
    }
    let mut queue: ArrayList<i64> = ArrayList::new(nodes as usize)
    index = 0
    while index < nodes {
        if indegree⁅index as usize⁆ == 0 {
            queue.push(index)
        }
        index = index + 1
    }
    let mut head: i64 = 0
    let mut removed: i64 = 0
    while head < queue.length() as i64 {
        let node: i64 = queue⁅head as usize⁆
        head = head + 1
        removed = removed + 1
        loop next in graph.adjacency⁅node as usize⁆ {
            indegree.set_cardinal(next as usize, indegree⁅next as usize⁆ - 1)
            if indegree⁅next as usize⁆ == 0 {
                queue.push(next)
            }
        }
    }
    return removed
}

micro ring_graph(nodes: i64) -> Digraph {
    let mut graph: Digraph = digraph_new(nodes)
    add_edge(graph, 0, 1)
    add_edge(graph, 1, 2)
    add_edge(graph, 2, 0)
    add_edge(graph, 3, 4)
    add_edge(graph, 4, 3)
    add_edge(graph, 2, 3)
    return graph
}

# 6 节点：{0,1,2} 与 {3,4} 两个环，节点 5 孤立 → 3 个强连通分量。
[export(name: "sccCount")]
micro scc_count_export() -> i64 {
    let graph: Digraph = ring_graph(6)
    return count_scc(graph, 6)
}

# 同一张图里存在环，Kahn 无法消去全部节点，必须可观察地报告 1。
[export(name: "cycleDetected")]
micro cycle_detected() -> i64 {
    let graph: Digraph = ring_graph(6)
    if kahn_removed(graph, 6) < 6 {
        return 1
    }
    return 0
}

# 对照：四节点链 0→1→2→3 无环，Kahn 全消，必须报告 0。
[export(name: "acyclicGraphNoCycle")]
micro acyclic_graph_no_cycle() -> i64 {
    let mut graph: Digraph = digraph_new(4)
    add_edge(graph, 0, 1)
    add_edge(graph, 1, 2)
    add_edge(graph, 2, 3)
    if kahn_removed(graph, 4) < 4 {
        return 1
    }
    return 0
}

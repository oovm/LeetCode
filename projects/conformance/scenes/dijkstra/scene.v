namespace probe.dijkstra;

using std.collection

structure Edge {
    to: i64
    weight: i64
}

structure Frontier {
    distance: i64
    node: i64
}

micro cmp_frontier(left: Frontier, right: Frontier) -> i32 {
    if left.distance < right.distance {
        return -1
    }
    if right.distance < left.distance {
        return 1
    }
    return 0
}

micro graph_new(nodes: i64) -> ArrayList<ArrayList<Edge>> {
    let mut adjacency: ArrayList<ArrayList<Edge>> = ArrayList::new(nodes as usize)
    let mut index: i64 = 0
    while index < nodes {
        let mut row: ArrayList<Edge> = ArrayList::new(2)
        adjacency.push(row)
        index = index + 1
    }
    return adjacency
}

micro add_edge(mut adjacency: ArrayList<ArrayList<Edge>>, from: i64, to: i64, weight: i64) -> unit {
    adjacency⁅from as usize⁆.push(Edge { to: to, weight: weight })
}

# Dijkstra：`BinaryHeap<Frontier>` 按距离出堆，出堆距离与当前最优不一致即为陈旧项。
micro dijkstra(adjacency: ArrayList<ArrayList<Edge>>, source: i64) -> ArrayList<i64> {
    let mut distances: ArrayList<i64> = ArrayList::new(adjacency.length())
    let mut index: i64 = 0
    while index < adjacency.length() as i64 {
        distances.push(-1)
        index = index + 1
    }
    distances.set_cardinal(source as usize, 0)
    let mut frontier: BinaryHeap<Frontier> = BinaryHeap::new_by(cmp_frontier)
    frontier.push(Frontier { distance: 0, node: source })
    while frontier.length() > 0 {
        let current: Frontier = frontier.pop().unwrap()
        if current.distance == distances⁅current.node as usize⁆ {
            loop edge in adjacency⁅current.node as usize⁆ {
                let candidate: i64 = current.distance + edge.weight
                let known: i64 = distances⁅edge.to as usize⁆
                if known == -1 || candidate < known {
                    distances.set_cardinal(edge.to as usize, candidate)
                    frontier.push(Frontier { distance: candidate, node: edge.to })
                }
            }
        }
    }
    return distances
}

micro weighted_graph() -> ArrayList<ArrayList<Edge>> {
    let mut adjacency: ArrayList<ArrayList<Edge>> = graph_new(6)
    add_edge(adjacency, 0, 1, 4)
    add_edge(adjacency, 0, 2, 1)
    add_edge(adjacency, 2, 1, 2)
    add_edge(adjacency, 1, 3, 1)
    add_edge(adjacency, 2, 3, 5)
    add_edge(adjacency, 3, 4, 3)
    return adjacency
}

[export(name: "dijkstraDistances")]
micro dijkstra_distances() -> i64 {
    let distances: ArrayList<i64> = dijkstra(weighted_graph(), 0)
    return distances⁅1 as usize⁆ + distances⁅2 as usize⁆ * 10 + distances⁅3 as usize⁆ * 100 + distances⁅4 as usize⁆ * 1000
}

[export(name: "dijkstraUnreachable")]
micro dijkstra_unreachable() -> i64 {
    let distances: ArrayList<i64> = dijkstra(weighted_graph(), 0)
    return distances⁅5 as usize⁆
}

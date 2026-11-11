namespace leetcode.all_paths_from_source_lead_to_destination;

using std.collection;

# 三色 DFS：0 未访问 / 1 在当前路径 / 2 已验证安全。
# 目标点不允许有出边，死胡同必须恰好是目标点，回到「在路径」节点说明存在环。
micro path_ok(node: i64, destination: i64, graph: ArrayList<ArrayList<i64>>, color: ArrayList<i64>) -> bool {
    let index: usize = node as usize
    if color⁅index⁆ == 1 {
        return false
    }
    if color⁅index⁆ == 2 {
        return true
    }

    let outgoing: ArrayList<i64> = graph⁅index⁆
    if node == destination {
        if outgoing.length() != 0 {
            return false
        }
        color⁅index⁆ = 2
        return true
    }
    if outgoing.length() == 0 {
        return false
    }

    color⁅index⁆ = 1
    let mut cursor: usize = 0
    while cursor < outgoing.length() {
        if path_ok(outgoing⁅cursor⁆, destination, graph, color) == false {
            return false
        }
        cursor = cursor + 1
    }
    color⁅index⁆ = 2
    return true
}

[export(case: "camelCase")]
micro leadsToDestination(n: i64, edges: [[i64]], source: i64, destination: i64) -> bool {
    let count: usize = n as usize
    let mut graph: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        graph.push(row)
        fill = fill + 1
    }

    let mut index: usize = 0
    while index < edges.length() {
        let edge: [i64] = edges⁅index⁆
        let from: i64 = edge⁅0⁆
        let to: i64 = edge⁅1⁆
        let mut outgoing: ArrayList<i64> = graph⁅from as usize⁆
        outgoing.push(to)
        graph.set((from + 1) as isize, outgoing)
        index = index + 1
    }

    let mut color: ArrayList<i64> = ArrayList::new(count)
    fill = 0
    while fill < count {
        color.push(0)
        fill = fill + 1
    }
    return path_ok(source, destination, graph, color)
}

class Solution {
    micro leadsToDestination(self, n: i64, edges: [[i64]], source: i64, destination: i64): bool {
        return leadsToDestination(n, edges, source, destination)
    }
}

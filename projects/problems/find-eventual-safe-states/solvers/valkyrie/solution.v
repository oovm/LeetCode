namespace leetcode.find_eventual_safe_states;

using std.collection;

# 反向图 + Kahn：出度为 0 的节点安全，删掉它后前驱出度递减。
# 队列用 `Deque`，反转邻接表用 `ArrayList<ArrayList<i64>>`。
[export(case: "camelCase")]
micro eventualSafeNodes(graph: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let count: usize = graph.length()
    let mut out_degree: ArrayList<i64> = ArrayList::new(count)
    let mut reverse: ArrayList<ArrayList<i64>> = ArrayList::new(count)

    let mut fill: usize = 0
    while fill < count {
        out_degree.push(graph⁅fill⁆.length() as i64)
        reverse.push(ArrayList::new(0))
        fill = fill + 1
    }

    let mut node: usize = 0
    let limit: i64 = count as i64
    while node < count {
        let edges: ArrayList<i64> = graph⁅node⁆
        let mut index: usize = 0
        while index < edges.length() {
            let target: i64 = edges⁅index⁆
            if target >= 0 && target < limit {
                let mut incoming: ArrayList<i64> = reverse⁅target as usize⁆
                incoming.push(node as i64)
                reverse.set((target + 1) as isize, incoming)
            }
            index = index + 1
        }
        node = node + 1
    }

    let mut queue: Deque<i64> = Deque::new()
    fill = 0
    while fill < count {
        if out_degree⁅fill⁆ == 0 {
            queue.push_back(fill as i64)
        }
        fill = fill + 1
    }

    while queue.is_empty() == false {
        let current: i64 = queue.pop_front().unwrap()
        let predecessors: ArrayList<i64> = reverse⁅current as usize⁆
        let mut index: usize = 0
        while index < predecessors.length() {
            let source: i64 = predecessors⁅index⁆
            let source_index: usize = source as usize
            out_degree.set((source + 1) as isize, out_degree⁅source_index⁆ - 1)
            if out_degree⁅source_index⁆ == 0 {
                queue.push_back(source)
            }
            index = index + 1
        }
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut cursor: usize = 0
    while cursor < count {
        if out_degree⁅cursor⁆ == 0 {
            result.push(cursor as i64)
        }
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro eventualSafeNodes(self, graph: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return eventualSafeNodes(graph)
    }
}

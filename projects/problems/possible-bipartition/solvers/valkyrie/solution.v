namespace leetcode.solution

using std.collection

# 二色着色：把「讨厌」看成无向边，从每个未染色点 BFS 交替染色，任一条边两端同色即不可二分。
# std 的 graph 模块已有 cycle / topological_sort / bfs / dfs 与 successors，唯独没有二色判定入口（G9），
# 这里在 DirectedGraph 上组合，不另造图结构。入参是嵌套 ArrayList，marshal 面待验证。
class Solution {
    [export(case: "possibleBipartition")]
    micro possibleBipartition(n: i64, dislikes: ArrayList<ArrayList<i64>>) -> bool {
        let size: usize = n as usize
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
        let mut color: HashMap<i64, i64> = HashMap::new(size)
        let mut start: i64 = 1
        while start <= n {
            if !color.contains_key(start) {
                color.insert(start, 0)
                let mut queue: ArrayList<i64> = ArrayList::new(size)
                queue.push(start)
                let mut head: usize = 0
                while head < queue.length() {
                    let current: i64 = queue⁅head⁆
                    head = head + 1
                    let wanted: i64 = 1 - color.get(current).unwrap()
                    let neighbours: ArrayList<i64> = graph.successors(current)
                    let mut index: usize = 0
                    while index < neighbours.length() {
                        let next: i64 = neighbours⁅index⁆
                        if !color.contains_key(next) {
                            color.insert(next, wanted)
                            queue.push(next)
                        } else if color.get(next).unwrap() != wanted {
                            return false
                        }
                        index = index + 1
                    }
                }
            }
            start = start + 1
        }
        return true
    }
}

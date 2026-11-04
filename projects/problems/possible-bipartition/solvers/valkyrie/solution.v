namespace leetcode.possible_bipartition;

# 讨厌关系视为无向边，n 个点整体二色着色；任一条边两端同色即不可二分。
[export(case: "camelCase")]
micro possible_bipartition(n: i64, dislikes: ArrayList<ArrayList<i64>>) -> bool {
    let size: usize = n as usize
    let mut network: DirectedGraph<i64> = DirectedGraph::new()
    let mut person: i64 = 1
    while person <= n {
        network.add_node(person)
        person = person + 1
    }

    loop pair in dislikes {
        network.add_edge(pair⁅0⁆, pair⁅1⁆)
        network.add_edge(pair⁅1⁆, pair⁅0⁆)
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
                let neighbours: ArrayList<i64> = network.successors(current)
                let mut k: usize = 0
                while k < neighbours.length() {
                    let next: i64 = neighbours⁅k⁆
                    if !color.contains_key(next) {
                        color.insert(next, wanted)
                        queue.push(next)
                    } else if color.get(next).unwrap() != wanted {
                        return false
                    }
                    k = k + 1
                }
            }
        }
        start = start + 1
    }
    return true
}

class Solution {
    micro possibleBipartition(self, n: i64, dislikes: ArrayList<ArrayList<i64>>): bool {
        return possible_bipartition(n, dislikes)
    }
}

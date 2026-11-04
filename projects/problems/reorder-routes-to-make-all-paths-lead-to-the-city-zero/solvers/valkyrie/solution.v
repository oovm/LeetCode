namespace leetcode.reorder_routes_to_make_all_paths_lead_to_the_city_zero;

using std.collection;

# 邻接边带方向标记：1 表示原方向（背离 0），0 表示反向边。
# 从 0 做一次 DFS，凡是沿原方向走出去的边都要翻转。
[export(case: "camelCase")]
micro minReorder(n: i64, connections: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = n as usize
    let mut adjacency: HashMap<i64, ArrayList<ArrayList<i64>>> = HashMap::new(count)

    let mut index: usize = 0
    while index < count {
        adjacency.insert(index as i64, ArrayList::new(0))
        index = index + 1
    }

    index = 0
    while index < connections.length() {
        let link: ArrayList<i64> = connections⁅index⁆
        let from: i64 = link⁅0⁆
        let to: i64 = link⁅1⁆

        let mut from_list: ArrayList<ArrayList<i64>> = adjacency.get(from).unwrap()
        let mut forward: ArrayList<i64> = ArrayList::new(2)
        forward.push(to)
        forward.push(1)
        from_list.push(forward)
        adjacency.insert(from, from_list)

        let mut to_list: ArrayList<ArrayList<i64>> = adjacency.get(to).unwrap()
        let mut backward: ArrayList<i64> = ArrayList::new(2)
        backward.push(from)
        backward.push(0)
        to_list.push(backward)
        adjacency.insert(to, to_list)

        index = index + 1
    }

    let mut visited: ArrayList<bool> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        visited.push(false)
        fill = fill + 1
    }

    let mut reversals: i64 = 0
    let mut stack: Deque<i64> = Deque::new()
    visited.set(1, true)
    stack.push_back(0)

    while stack.is_empty() == false {
        let node: i64 = stack.pop_back().unwrap()
        let edges: ArrayList<ArrayList<i64>> = adjacency.get(node).unwrap()
        let mut cursor: usize = 0
        while cursor < edges.length() {
            let edge: ArrayList<i64> = edges⁅cursor⁆
            let next: i64 = edge⁅0⁆
            let direction: i64 = edge⁅1⁆
            let next_index: usize = next as usize
            if visited⁅next_index⁆ == false {
                visited.set((next + 1) as isize, true)
                if direction == 1 {
                    reversals = reversals + 1
                }
                stack.push_back(next)
            }
            cursor = cursor + 1
        }
    }
    return reversals
}

class Solution {
    micro minReorder(self, n: i64, connections: ArrayList<ArrayList<i64>>): i64 {
        return minReorder(n, connections)
    }
}

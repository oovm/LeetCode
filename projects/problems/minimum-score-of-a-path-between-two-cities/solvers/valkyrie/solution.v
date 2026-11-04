namespace leetcode.minimum_score_of_a_path_between_two_cities;

using std.collection;

# 城市图是连通无向图，1 与 n 必在同一分量。
# 从 1 做一次 DFS，路径分数就是该分量内最小的那条边。
[export(case: "camelCase")]
micro minScore(n: i64, roads: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = n as usize
    let mut adjacency: HashMap<i64, ArrayList<ArrayList<i64>>> = HashMap::new(count)

    let mut index: usize = 0
    while index < count {
        adjacency.insert(index as i64, ArrayList::new(0))
        index = index + 1
    }

    index = 0
    while index < roads.length() {
        let road: ArrayList<i64> = roads⁅index⁆
        let from: i64 = road⁅0⁆
        let to: i64 = road⁅1⁆
        let distance: i64 = road⁅2⁆

        let mut from_list: ArrayList<ArrayList<i64>> = adjacency.get(from).unwrap()
        let mut forward: ArrayList<i64> = ArrayList::new(2)
        forward.push(to)
        forward.push(distance)
        from_list.push(forward)
        adjacency.insert(from, from_list)

        let mut to_list: ArrayList<ArrayList<i64>> = adjacency.get(to).unwrap()
        let mut backward: ArrayList<i64> = ArrayList::new(2)
        backward.push(from)
        backward.push(distance)
        to_list.push(backward)
        adjacency.insert(to, to_list)

        index = index + 1
    }

    let mut visited: ArrayList<bool> = ArrayList::new(count + 1)
    let mut fill: usize = 0
    while fill <= count {
        visited.push(false)
        fill = fill + 1
    }

    let mut best: i64 = 1000000000000
    let mut stack: Deque<i64> = Deque::new()
    visited.set(2, true)
    stack.push_back(1)

    while stack.is_empty() == false {
        let node: i64 = stack.pop_back().unwrap()
        let edges: ArrayList<ArrayList<i64>> = adjacency.get(node).unwrap()
        let mut cursor: usize = 0
        while cursor < edges.length() {
            let edge: ArrayList<i64> = edges⁅cursor⁆
            let next: i64 = edge⁅0⁆
            let distance: i64 = edge⁅1⁆
            if distance < best {
                best = distance
            }
            let next_index: usize = next as usize
            if visited⁅next_index⁆ == false {
                visited.set((next + 1) as isize, true)
                stack.push_back(next)
            }
            cursor = cursor + 1
        }
    }
    return best
}

class Solution {
    micro minScore(self, n: i64, roads: ArrayList<ArrayList<i64>>): i64 {
        return minScore(n, roads)
    }
}

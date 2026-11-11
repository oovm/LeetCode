namespace leetcode.solution

using std.collection

# 题内触发点: G25 —— BFS 状态是「当前节点 + 已访问节点掩码」，访问表用 `BitSet(n * 2^n)`。
# 容量由题面上界（n <= 12）给出，因而只用到现有 `get` / `set`；本解不依赖 `count` / `length` / 迭代，
# 也不作「BitSet 已能自报规模」的假设。
class Solution {
    [export(case: "camelCase")]
    micro shortestPathLength(graph: [[i64]]) -> i64 {
        let nodes: usize = graph.length()
        let states: i64 = (1 as i64) << (nodes as i64)
        let mut visited: BitSet = BitSet::with_capacity((nodes as i64 * states) as usize)
        let mut queue: Deque<i64> = Deque::new()

        # 多源 BFS：每个节点都可以作为起点，初始掩码只含自身。
        let mut node: usize = 0
        while node < nodes {
            let mask: i64 = (1 as i64) << (node as i64)
            let state: i64 = (node as i64) * states + mask
            visited.set(state as usize)
            queue.push_back(state)
            node = node + 1
        }

        let full: i64 = states - 1
        let mut steps: i64 = 0
        while queue.length() > 0 {
            let layer: usize = queue.length()
            let mut cursor: usize = 0
            while cursor < layer {
                let state: i64 = queue.pop_front().unwrap()
                let mask: i64 = state % states
                let current: i64 = state / states
                if mask == full {
                    return steps
                }
                loop next in graph⁅current as usize⁆ {
                    let next_mask: i64 = mask | ((1 as i64) << next)
                    let next_state: i64 = next * states + next_mask
                    if !visited.get(next_state as usize) {
                        visited.set(next_state as usize)
                        queue.push_back(next_state)
                    }
                }
                cursor = cursor + 1
            }
            steps = steps + 1
        }
        return 0
    }
}

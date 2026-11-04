namespace leetcode.node_with_highest_edge_score;

using std.collection;

# 单次遍历：把每条边的起点编号累加到终点分数，同时维护分数最高（并列取最小编号）的节点。
[export(case: "camelCase")]
micro edgeScore(edges: ArrayList<i64>) -> i64 {
    let count: usize = edges.length()

    let mut score: ArrayList<i64> = ArrayList::new(count)
    let mut fill: usize = 0
    while fill < count {
        score.push(0)
        fill = fill + 1
    }

    let mut best: i64 = 0
    let mut index: usize = 0
    while index < count {
        let target: i64 = edges⁅index⁆
        let target_index: usize = target as usize
        let accumulated: i64 = score⁅target_index⁆ + index as i64
        score.set((target + 1) as isize, accumulated)

        let best_score: i64 = score⁅best as usize⁆
        if best_score < accumulated || (best_score == accumulated && target < best) {
            best = target
        }

        index = index + 1
    }
    return best
}

class Solution {
    micro edgeScore(self, edges: ArrayList<i64>): i64 {
        return edgeScore(edges)
    }
}

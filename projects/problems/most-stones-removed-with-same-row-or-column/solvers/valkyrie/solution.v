namespace leetcode.most_stones_removed_with_same_row_or_column;

using std.collection;

# 行与列是两类节点，石子把所在行、列连成一条无向关系；同一无向分量内可删到只剩一颗石子。
# std 没有无向图类型，无向关系由并查集承载（G8 讨论方向性未成为图模型一等属性）。
[export(case: "camelCase")]
micro remove_stones(stones: ArrayList<ArrayList<i64>>) -> i64 {
    let mut sets: DisjointSet<i64> = DisjointSet::new()
    loop stone in stones {
        let row: i64 = stone⁅0⁆
        let column: i64 = stone⁅1⁆
        # 列节点取负值，避免与行号冲突。
        sets.union(row, -column - 1)
    }

    let total: i64 = stones.length() as i64
    let groups: i64 = sets.group_count() as i64
    return total - groups
}

class Solution {
    micro removeStones(self, stones: ArrayList<ArrayList<i64>>): i64 {
        return remove_stones(stones)
    }
}

namespace leetcode.binary_tree_zigzag_level_order_traversal;

using std.collection;

# 按层索引 BFS：每层收集当前层的值，奇数层反转；下一层由当前层每个节点的两子节点组成。
[export(case: "camelCase")]
micro zigzagLevelOrder(root: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    if root.length() == 0 {
        return out
    }
    let mut level: ArrayList<i64> = ArrayList::new(1)
    level.push(0)
    let mut left_to_right: bool = true
    while level.length() > 0 {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        if left_to_right {
            let mut slot: usize = 0
            while slot < level.length() {
                row.push(root⁅level⁅slot⁆ as usize⁆)
                slot = slot + 1
            }
        } else {
            let mut slot: i64 = level.length() as i64 - 1
            while slot >= 0 {
                row.push(root⁅level⁅slot as usize⁆ as usize⁆)
                slot = slot - 1
            }
        }
        out.push(row)
        let mut next: ArrayList<i64> = ArrayList::new(0)
        let mut slot: usize = 0
        while slot < level.length() {
            let idx: usize = level⁅slot⁆ as usize
            let left: usize = 2 * idx + 1
            if left < root.length() {
                next.push(left as i64)
            }
            let right: usize = left + 1
            if right < root.length() {
                next.push(right as i64)
            }
            slot = slot + 1
        }
        level = next
        left_to_right = !left_to_right
    }
    return out
}

class Solution {
    micro zigzagLevelOrder(self, root: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return zigzagLevelOrder(root)
    }
}

namespace leetcode.binary_tree_level_order_traversal;

using std.collection;

# 堆式下标按层 BFS：每层索引展开为子索引；空树返回空表。
[export(case: "camelCase")]
micro levelOrder(root: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    if root.length() == 0 {
        return out
    }
    let mut level: ArrayList<i64> = ArrayList::new(1)
    level.push(0)
    while level.length() > 0 {
        let mut row: ArrayList<i64> = ArrayList::new(0)
        loop idx in level {
            row.push(root⁅idx as usize⁆)
        }
        out.push(row)
        let mut next: ArrayList<i64> = ArrayList::new(0)
        loop idx in level {
            let left: usize = 2 * idx as usize + 1
            if left < root.length() {
                next.push(left as i64)
            }
            let right: usize = left + 1
            if right < root.length() {
                next.push(right as i64)
            }
        }
        level = next
    }
    return out
}

class Solution {
    micro levelOrder(self, root: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return levelOrder(root)
    }
}

namespace leetcode.binary_tree_preorder_traversal;

# 层序数组按堆式下标访问，前序递归（根 → 左 → 右）收集。
micro walk(root: ArrayList<i64>, index: usize, out: ArrayList<i64>) -> unit {
    if index < root.length() {
        out.push(root⁅index⁆)
        walk(root, 2 * index + 1, out)
        walk(root, 2 * index + 2, out)
    }
}

[export(case: "camelCase")]
micro preorderTraversal(root: ArrayList<i64>) -> ArrayList<i64> {
    let mut out: ArrayList<i64> = ArrayList::new(root.length())
    walk(root, 0, out)
    return out
}

class Solution {
    micro preorderTraversal(self, root: ArrayList<i64>): ArrayList<i64> {
        return preorderTraversal(root)
    }
}

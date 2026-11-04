namespace leetcode.binary_tree_inorder_traversal;

# 输入是层序数组：按堆式下标访问子节点（左 `2i+1`、右 `2i+2`），中序递归收集。
micro walk(root: ArrayList<i64>, index: usize, out: ArrayList<i64>) -> unit {
    if index < root.length() {
        walk(root, 2 * index + 1, out)
        out.push(root⁅index⁆)
        walk(root, 2 * index + 2, out)
    }
}

[export(case: "camelCase")]
micro inorderTraversal(root: ArrayList<i64>) -> ArrayList<i64> {
    let mut out: ArrayList<i64> = ArrayList::new(root.length())
    walk(root, 0, out)
    return out
}

class Solution {
    micro inorderTraversal(self, root: ArrayList<i64>): ArrayList<i64> {
        return inorderTraversal(root)
    }
}

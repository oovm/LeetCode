namespace leetcode.binary_tree_postorder_traversal;

# 层序数组按堆式下标访问，后序递归（左 → 右 → 根）收集。
micro walk(root: ArrayList<i64>, index: usize, out: ArrayList<i64>) -> unit {
    if index < root.length() {
        walk(root, 2 * index + 1, out)
        walk(root, 2 * index + 2, out)
        out.push(root⁅index⁆)
    }
}

[export(case: "camelCase")]
micro postorderTraversal(root: ArrayList<i64>) -> ArrayList<i64> {
    let mut out: ArrayList<i64> = ArrayList::new(root.length())
    walk(root, 0, out)
    return out
}

class Solution {
    micro postorderTraversal(self, root: ArrayList<i64>): ArrayList<i64> {
        return postorderTraversal(root)
    }
}

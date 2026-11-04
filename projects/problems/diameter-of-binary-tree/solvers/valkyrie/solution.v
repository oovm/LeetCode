namespace leetcode.diameter_of_binary_tree;

# 后序高度递归时顺带记录「穿过当前节点的左右高度和」，一趟遍历得到直径。
# `best` 用单格 `ArrayList<i64>` 作可变累加器，递归各层共享同一引用。
micro depth(root: ArrayList<i64>, index: usize, best: ArrayList<i64>) -> i64 {
    if index >= root.length() {
        return 0
    }
    let left: i64 = depth(root, 2 * index + 1, best)
    let right: i64 = depth(root, 2 * index + 2, best)
    let through: i64 = left + right
    if through > best⁅0⁆ {
        best⁅0⁆ = through
    }
    if left > right {
        return left + 1
    }
    return right + 1
}

[export(case: "camelCase")]
micro diameterOfBinaryTree(root: ArrayList<i64>) -> i64 {
    let mut best: ArrayList<i64> = ArrayList::new(1)
    best.push(0)
    depth(root, 0, best)
    return best⁅0⁆
}

class Solution {
    micro diameterOfBinaryTree(self, root: ArrayList<i64>): i64 {
        return diameterOfBinaryTree(root)
    }
}

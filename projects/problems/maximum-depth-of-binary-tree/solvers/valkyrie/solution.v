namespace leetcode.maximum_depth_of_binary_tree;

micro depth_of(root: ArrayList<i64>, i: usize) -> i64 {
    if i >= root.length() {
        return 0
    }
    let left: i64 = depth_of(root, 2 * i + 1)
    let right: i64 = depth_of(root, 2 * i + 2)
    if left > right {
        return 1 + left
    }
    return 1 + right
}

[export(case: "camelCase")]
micro max_depth(root: ArrayList<i64>) -> i64 {
    return depth_of(root, 0)
}

class Solution {
    micro maxDepth(self, root: ArrayList<i64>): i64 {
        return max_depth(root)
    }
}

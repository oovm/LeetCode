namespace leetcode.univalued_binary_tree;

using std.collection;

# 堆式下标递归：与根值不一致即 false，左右子树同时一致才 true。
micro all_equal(root: ArrayList<i64>, i: usize, value: i64) -> bool {
    if i >= root.length() {
        return true
    }
    if root⁅i⁆ != value {
        return false
    }
    return all_equal(root, 2 * i + 1, value) && all_equal(root, 2 * i + 2, value)
}

[export(case: "camelCase")]
micro isUnivalTree(root: ArrayList<i64>) -> bool {
    if root.length() == 0 {
        return true
    }
    return all_equal(root, 0, root⁅0⁆)
}

class Solution {
    micro isUnivalTree(self, root: ArrayList<i64>): bool {
        return isUnivalTree(root)
    }
}

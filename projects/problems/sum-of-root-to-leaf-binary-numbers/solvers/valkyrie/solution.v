namespace leetcode.sum_of_root_to_leaf_binary_numbers;

using std.collection;

# 堆式下标 DFS：路径值 acc = acc * 2 + bit；叶（无左子）返回 acc，否则左右相加。
micro dfs(root: ArrayList<i64>, i: usize, acc: i64) -> i64 {
    if i >= root.length() {
        return 0
    }
    let value: i64 = acc * 2 + root⁅i⁆
    if 2 * i + 1 >= root.length() {
        return value
    }
    return dfs(root, 2 * i + 1, value) + dfs(root, 2 * i + 2, value)
}

[export(case: "camelCase")]
micro sumRootToLeaf(root: ArrayList<i64>) -> i64 {
    return dfs(root, 0, 0)
}

class Solution {
    micro sumRootToLeaf(self, root: ArrayList<i64>): i64 {
        return sumRootToLeaf(root)
    }
}

namespace leetcode.sum_root_to_leaf_numbers;

using std.collection;

# 堆式下标递归：累计路径值 acc = acc * 10 + node；叶节点（无左子）返回 acc，否则两子相加。
micro dfs(root: ArrayList<i64>, i: usize, acc: i64) -> i64 {
    if i >= root.length() {
        return 0
    }
    let value: i64 = acc * 10 + root⁅i⁆
    if 2 * i + 1 >= root.length() {
        return value
    }
    return dfs(root, 2 * i + 1, value) + dfs(root, 2 * i + 2, value)
}

[export(case: "camelCase")]
micro sumNumbers(root: ArrayList<i64>) -> i64 {
    return dfs(root, 0, 0)
}

class Solution {
    micro sumNumbers(self, root: ArrayList<i64>): i64 {
        return sumNumbers(root)
    }
}

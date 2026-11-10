namespace leetcode.range_sum_of_bst;

using std.collection;

# 堆式下标递归 + BST 剪枝：节点在区间内才累加，左子可能命中 low、右子可能命中 high。
micro dfs(root: ArrayList<i64>, i: usize, low: i64, high: i64) -> i64 {
    if i >= root.length() {
        return 0
    }
    let value: i64 = root⁅i⁆
    let mut total: i64 = 0
    if value >= low && value <= high {
        total = value
    }
    if value > low {
        total = total + dfs(root, 2 * i + 1, low, high)
    }
    if value < high {
        total = total + dfs(root, 2 * i + 2, low, high)
    }
    return total
}

[export(case: "camelCase")]
micro rangeSumBST(root: ArrayList<i64>, low: i64, high: i64) -> i64 {
    return dfs(root, 0, low, high)
}

class Solution {
    micro rangeSumBST(self, root: ArrayList<i64>, low: i64, high: i64): i64 {
        return rangeSumBST(root, low, high)
    }
}

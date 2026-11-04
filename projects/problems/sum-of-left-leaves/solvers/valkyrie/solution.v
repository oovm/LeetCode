namespace leetcode.sum_of_left_leaves;

# 递归携带「当前节点是否是左孩子」：两侧都没有子节点且来自左侧，就是左叶子。
micro left_sum(root: ArrayList<i64>, index: usize, is_left: bool) -> i64 {
    if index >= root.length() {
        return 0
    }
    let left: usize = 2 * index + 1
    let right: usize = 2 * index + 2
    if is_left {
        if left >= root.length() {
            if right >= root.length() {
                return root⁅index⁆
            }
        }
    }
    return left_sum(root, left, true) + left_sum(root, right, false)
}

[export(case: "camelCase")]
micro sumOfLeftLeaves(root: ArrayList<i64>) -> i64 {
    return left_sum(root, 0, false)
}

class Solution {
    micro sumOfLeftLeaves(self, root: ArrayList<i64>): i64 {
        return sumOfLeftLeaves(root)
    }
}

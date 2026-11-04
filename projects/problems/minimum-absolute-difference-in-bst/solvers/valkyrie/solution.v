namespace leetcode.minimum_absolute_difference_in_bst;

# BST 的中序遍历是升序：相邻两个值之差的最小值就是答案。
# 用三格状态 `[上一个值, 当前最小差, 是否已有上一个]` 携带递归上下文，额外空间只有递归栈。
micro inorder_diff(root: ArrayList<i64>, index: usize, state: ArrayList<i64>) -> unit {
    if index < root.length() {
        inorder_diff(root, 2 * index + 1, state)
        let value: i64 = root⁅index⁆
        if state⁅2⁆ == 1 {
            let gap: i64 = value - state⁅0⁆
            if gap < state⁅1⁆ {
                state⁅1⁆ = gap
            }
        }
        state⁅0⁆ = value
        state⁅2⁆ = 1
        inorder_diff(root, 2 * index + 2, state)
    }
}

[export(case: "camelCase")]
micro getMinimumDifference(root: ArrayList<i64>) -> i64 {
    let mut state: ArrayList<i64> = ArrayList::new(3)
    state.push(0)
    state.push(1000000000000000000)
    state.push(0)
    inorder_diff(root, 0, state)
    return state⁅1⁆
}

class Solution {
    micro getMinimumDifference(self, root: ArrayList<i64>): i64 {
        return getMinimumDifference(root)
    }
}

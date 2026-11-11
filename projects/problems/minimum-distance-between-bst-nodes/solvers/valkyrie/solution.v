namespace leetcode.minimum_distance_between_bst_nodes;

using std.collection;

# 中序遍历相邻差最小：`state⁅0⁆` 前驱值、`state⁅1⁆` 当前最小、`state⁅2⁆` 是否有前驱。
micro inorder(root: ArrayList<i64>, i: usize, state: ArrayList<i64>) -> unit {
    if i >= root.length() {
        return
    }
    inorder(root, 2 * i + 1, state)
    if state⁅2⁆ == 1 {
        let diff: i64 = root⁅i⁆ - state⁅0⁆
        if diff < state⁅1⁆ {
            state⁅1⁆ = diff
        }
    }
    state⁅0⁆ = root⁅i⁆
    state⁅2⁆ = 1
    inorder(root, 2 * i + 2, state)
}

[export(case: "camelCase")]
micro minDiffInBST(root: ArrayList<i64>) -> i64 {
    let mut state: ArrayList<i64> = ArrayList::new(3)
    state.push(0)
    state.push(9223372036854775807)
    state.push(0)
    inorder(root, 0, state)
    return state⁅1⁆
}

class Solution {
    micro minDiffInBST(self, root: ArrayList<i64>): i64 {
        return minDiffInBST(root)
    }
}

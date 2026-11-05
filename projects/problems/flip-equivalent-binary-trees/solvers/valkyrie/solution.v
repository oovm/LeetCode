namespace leetcode.flip_equivalent_binary_trees;

using std.collection;

# 两棵树的层序数组用同一套堆式下标（左 2i+1，右 2i+2）。
# 递归同时接受「不交换」和「交换」两种对齐方式。
micro equivalent(left: ArrayList<i64>, li: usize, right: ArrayList<i64>, ri: usize) -> bool {
    let left_done: bool = li >= left.length()
    let right_done: bool = ri >= right.length()
    if left_done || right_done {
        return left_done && right_done
    }
    if left⁅li⁆ != right⁅ri⁆ {
        return false
    }
    let left_left: usize = li * 2 + 1
    let left_right: usize = li * 2 + 2
    let right_left: usize = ri * 2 + 1
    let right_right: usize = ri * 2 + 2
    if equivalent(left, left_left, right, right_left) && equivalent(left, left_right, right, right_right) {
        return true
    }
    return equivalent(left, left_left, right, right_right) && equivalent(left, left_right, right, right_left)
}

[export(case: "camelCase")]
micro flip_equiv(root1: ArrayList<i64>, root2: ArrayList<i64>) -> bool {
    return equivalent(root1, 0, root2, 0)
}

class Solution {
    micro flipEquiv(self, root1: ArrayList<i64>, root2: ArrayList<i64>): bool {
        return flip_equiv(root1, root2)
    }
}

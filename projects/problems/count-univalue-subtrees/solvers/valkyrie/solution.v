namespace leetcode.count_univalue_subtrees;

using std.collection;

# 堆式下标递归：返回「以 i 为根的子树是否单值」；左右都单值且子节点（若存在）等于根值即累计。
micro dfs(root: ArrayList<i64>, i: usize, counter: ArrayList<i64>) -> bool {
    if i >= root.length() {
        return true
    }
    let left: bool = dfs(root, 2 * i + 1, counter)
    let right: bool = dfs(root, 2 * i + 2, counter)
    let left_ok: bool = 2 * i + 1 >= root.length() || root⁅2 * i + 1⁆ == root⁅i⁆
    let right_ok: bool = 2 * i + 2 >= root.length() || root⁅2 * i + 2⁆ == root⁅i⁆
    let ok: bool = left && right && left_ok && right_ok
    if ok {
        counter⁅0⁆ = counter⁅0⁆ + 1
    }
    return ok
}

[export(case: "camelCase")]
micro countUnivalSubtrees(root: ArrayList<i64>) -> i64 {
    let mut counter: ArrayList<i64> = ArrayList::new(1)
    counter.push(0)
    dfs(root, 0, counter)
    return counter⁅0⁆
}

class Solution {
    micro countUnivalSubtrees(self, root: ArrayList<i64>): i64 {
        return countUnivalSubtrees(root)
    }
}

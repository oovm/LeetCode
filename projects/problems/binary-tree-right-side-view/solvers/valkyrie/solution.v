namespace leetcode.binary_tree_right_side_view;

using std.collection;

# 堆式下标 DFS，先右后左：每层第一次到达的节点即右视图。
micro dfs(root: ArrayList<i64>, index: usize, depth: usize, mut answer: ArrayList<i64>) -> unit {
    if index >= root.length() {
        return
    }
    if depth == answer.length() {
        answer.push(root⁅index⁆)
    }
    dfs(root, 2 * index + 2, depth + 1, answer)
    dfs(root, 2 * index + 1, depth + 1, answer)
}

[export(case: "camelCase")]
micro rightSideView(root: ArrayList<i64>) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(0)
    dfs(root, 0, 0, answer)
    return answer
}

class Solution {
    micro rightSideView(self, root: ArrayList<i64>): ArrayList<i64> {
        return rightSideView(root)
    }
}

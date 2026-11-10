namespace leetcode.path_sum_iii;

using std.collection;

# 堆式下标双重递归：`count_down` 从当前节点向下累计等于目标的和路径；`dfs` 遍历每个起点。
micro count_down(root: ArrayList<i64>, i: usize, acc: i64, target: i64) -> i64 {
    if i >= root.length() {
        return 0
    }
    let sum: i64 = acc + root⁅i⁆
    let mut n: i64 = 0
    if sum == target {
        n = 1
    }
    n = n + count_down(root, 2 * i + 1, sum, target)
    n = n + count_down(root, 2 * i + 2, sum, target)
    return n
}

micro dfs(root: ArrayList<i64>, i: usize, target: i64) -> i64 {
    if i >= root.length() {
        return 0
    }
    return count_down(root, i, 0, target) + dfs(root, 2 * i + 1, target) + dfs(root, 2 * i + 2, target)
}

[export(case: "camelCase")]
micro pathSum(root: ArrayList<i64>, targetSum: i64) -> i64 {
    return dfs(root, 0, targetSum)
}

class Solution {
    micro pathSum(self, root: ArrayList<i64>, targetSum: i64): i64 {
        return pathSum(root, targetSum)
    }
}

namespace leetcode.balanced_binary_tree;

# 自底向上高度校验：返回 -1 表示子树已不平衡，正数表示该子树高度，单次遍历 O(n)。
micro height(root: ArrayList<i64>, index: usize) -> i64 {
    if index >= root.length() {
        return 0
    }
    let left: i64 = height(root, 2 * index + 1)
    let right: i64 = height(root, 2 * index + 2)
    if left < 0 {
        return 0 - 1
    }
    if right < 0 {
        return 0 - 1
    }
    let mut diff: i64 = left - right
    if diff < 0 {
        diff = 0 - diff
    }
    if diff > 1 {
        return 0 - 1
    }
    if left > right {
        return left + 1
    }
    return right + 1
}

[export(case: "camelCase")]
micro isBalanced(root: ArrayList<i64>) -> bool {
    return height(root, 0) >= 0
}

class Solution {
    micro isBalanced(self, root: ArrayList<i64>): bool {
        return isBalanced(root)
    }
}

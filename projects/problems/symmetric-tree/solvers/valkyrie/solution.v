namespace leetcode.symmetric_tree;

# 镜像判定：同时比较左子树的左孩子与右子树的右孩子、左子树的右孩子与右子树的左孩子。
micro mirror(root: ArrayList<i64>, left: usize, right: usize) -> bool {
    let left_exists: bool = left < root.length()
    let right_exists: bool = right < root.length()
    if left_exists == false {
        return right_exists == false
    }
    if right_exists == false {
        return false
    }
    if root⁅left⁆ != root⁅right⁆ {
        return false
    }
    if mirror(root, 2 * left + 1, 2 * right + 2) == false {
        return false
    }
    return mirror(root, 2 * left + 2, 2 * right + 1)
}

[export(case: "camelCase")]
micro isSymmetric(root: ArrayList<i64>) -> bool {
    return mirror(root, 1, 2)
}

class Solution {
    micro isSymmetric(self, root: ArrayList<i64>): bool {
        return isSymmetric(root)
    }
}

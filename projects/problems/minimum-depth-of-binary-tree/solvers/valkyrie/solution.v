namespace leetcode.minimum_depth_of_binary_tree;

# 缺失子节点用大哨兵表示：只有两侧都缺失才是叶子，否则取较小深度加一。
micro depth_of(root: ArrayList<i64>, index: usize) -> i64 {
    if index >= root.length() {
        return 1000000000
    }
    let left: i64 = depth_of(root, 2 * index + 1)
    let right: i64 = depth_of(root, 2 * index + 2)
    if left >= 1000000000 {
        if right >= 1000000000 {
            return 1
        }
    }
    if left < right {
        return left + 1
    }
    return right + 1
}

[export(case: "camelCase")]
micro minDepth(root: ArrayList<i64>) -> i64 {
    if root.length() == 0 {
        return 0
    }
    return depth_of(root, 0)
}

class Solution {
    micro minDepth(self, root: ArrayList<i64>): i64 {
        return minDepth(root)
    }
}

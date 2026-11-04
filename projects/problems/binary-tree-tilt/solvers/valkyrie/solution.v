namespace leetcode.binary_tree_tilt;

# 后序返回子树和，同时把当前节点的坡度累加进共享累加器，一趟遍历 O(n)。
micro tilt_walk(root: ArrayList<i64>, index: usize, total: ArrayList<i64>) -> i64 {
    if index >= root.length() {
        return 0
    }
    let left: i64 = tilt_walk(root, 2 * index + 1, total)
    let right: i64 = tilt_walk(root, 2 * index + 2, total)
    let mut diff: i64 = left - right
    if diff < 0 {
        diff = 0 - diff
    }
    total⁅0⁆ = total⁅0⁆ + diff
    return left + right + root⁅index⁆
}

[export(case: "camelCase")]
micro findTilt(root: ArrayList<i64>) -> i64 {
    let mut total: ArrayList<i64> = ArrayList::new(1)
    total.push(0)
    tilt_walk(root, 0, total)
    return total⁅0⁆
}

class Solution {
    micro findTilt(self, root: ArrayList<i64>): i64 {
        return findTilt(root)
    }
}

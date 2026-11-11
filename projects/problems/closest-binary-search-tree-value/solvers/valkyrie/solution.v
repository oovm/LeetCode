namespace leetcode.closest_binary_search_tree_value;

# BST 决定唯一搜索路径：按 target 大小关系下行，途中保留距离最近的值，等距取较小值。
# 题面 `target` 是浮点（LeetCode 270 原签名），这里按 `f64` 接收，返回值仍为整数值。
[export(case: "camelCase")]
micro closestValue(root: [i64], target: f64) -> i64 {
    if root.length() == 0 {
        return 0
    }
    let mut best: i64 = root⁅0⁆
    let mut index: usize = 0
    while index < root.length() {
        let value: i64 = root⁅index⁆
        let mut distance: f64 = value as f64 - target
        if distance < 0.0 {
            distance = 0.0 - distance
        }
        let mut best_distance: f64 = best as f64 - target
        if best_distance < 0.0 {
            best_distance = 0.0 - best_distance
        }
        if distance < best_distance {
            best = value
        }
        else {
            if distance == best_distance {
                if value < best {
                    best = value
                }
            }
        }
        if target < value as f64 {
            index = 2 * index + 1
        }
        else {
            index = 2 * index + 2
        }
    }
    return best
}

class Solution {
    micro closestValue(self, root: [i64], target: f64): i64 {
        return closestValue(root, target)
    }
}

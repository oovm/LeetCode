namespace leetcode.maximum_width_of_binary_tree;

using std.collection;

# 输入为无空洞的堆式层序数组，因此每层节点下标连续。
# 第 d 层覆盖 [2^d-1, 2^(d+1)-2] 与 [0,n) 的交集，宽度即交集长度，O(log n)。
micro power_two(exponent: i64) -> i64 {
    let mut value: i64 = 1
    let mut step: i64 = 0
    while step < exponent {
        value = value * 2
        step = step + 1
    }
    return value
}

[export(case: "camelCase")]
micro width_of_binary_tree(root: ArrayList<i64>) -> i64 {
    let total: i64 = root.length() as i64
    let mut best: i64 = 0
    let mut level: i64 = 0
    while true {
        let first: i64 = power_two(level) - 1
        if first >= total {
            break
        }
        let bound: i64 = power_two(level + 1) - 1
        let last: i64 = if bound < total { bound } else { total }
        let width: i64 = last - first
        if width > best {
            best = width
        }
        level = level + 1
    }
    return best
}

class Solution {
    micro widthOfBinaryTree(self, root: ArrayList<i64>): i64 {
        return width_of_binary_tree(root)
    }
}

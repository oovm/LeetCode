namespace leetcode.path_in_zigzag_labelled_binary_tree;

using std.collection;

# 完全二叉树第 i 层下标区间 [2^(i-1), 2^i - 1]，锯齿标签等于该层镜像值。
# 父标签由镜像后的标签右移一位得到，逐层上推到根。
[export(case: "camelCase")]
micro path_in_zig_zag_tree(label: i64) -> ArrayList<i64> {
    let mut depth: i64 = 1
    let mut first: i64 = 1
    while first * 2 <= label {
        first = first * 2
        depth = depth + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(depth as usize)
    let mut fill: i64 = 0
    while fill < depth {
        answer.push(0)
        fill = fill + 1
    }

    let mut current: i64 = label
    let mut level: i64 = depth
    while level > 0 {
        answer⁅(level - 1) as usize⁆ = current
        let low: i64 = 1 << (level - 1)
        let high: i64 = (1 << level) - 1
        current = (low + high - current) >> 1
        level = level - 1
    }
    return answer
}

class Solution {
    micro pathInZigZagTree(self, label: i64): ArrayList<i64> {
        return path_in_zig_zag_tree(label)
    }
}

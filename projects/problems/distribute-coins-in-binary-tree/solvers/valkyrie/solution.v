namespace leetcode.distribute_coins_in_binary_tree;

using std.collection;

micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

# 后序返回子树盈亏，子树的每次搬运量取两侧盈亏绝对值。
micro collect(root: [i64], index: usize, moves: ArrayList<i64>) -> i64 {
    if index >= root.length() {
        return 0
    }
    let left_index: usize = index * 2 + 1
    let right_index: usize = index * 2 + 2
    let mut left: i64 = 0
    let mut right: i64 = 0
    if left_index < root.length() {
        left = collect(root, left_index, moves)
    }
    if right_index < root.length() {
        right = collect(root, right_index, moves)
    }
    moves⁅0⁆ = moves⁅0⁆ + absolute(left) + absolute(right)
    return left + right + root⁅index⁆ - 1
}

[export(case: "camelCase")]
micro distribute_coins(root: [i64]) -> i64 {
    let mut moves: ArrayList<i64> = ArrayList::new(1)
    moves.push(0)
    collect(root, 0, moves)
    return moves⁅0⁆
}

class Solution {
    micro distributeCoins(self, root: [i64]): i64 {
        return distribute_coins(root)
    }
}

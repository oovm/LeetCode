namespace leetcode.binary_tree_longest_consecutive_sequence_ii;

using std.collection;

# 后序 DP：每个节点返回「向下最长递增链长」与「向下最长递减链长」，
# 两侧子树分别按值差 ±1 延长，候选答案为 incr+decr-1。O(n)。
micro walk(root: ArrayList<i64>, index: usize, best: ArrayList<i64>) -> ArrayList<i64> {
    let mut pair: ArrayList<i64> = ArrayList::new(2)
    if index >= root.length() {
        pair.push(0)
        pair.push(0)
        return pair
    }

    let value: i64 = root⁅index⁆
    let mut incr: i64 = 1
    let mut decr: i64 = 1

    let left: usize = 2 * index + 1
    if left < root.length() {
        let left_pair: ArrayList<i64> = walk(root, left, best)
        if root⁅left⁆ + 1 == value {
            incr = left_pair⁅0⁆ + 1
        }
        if root⁅left⁆ - 1 == value {
            decr = left_pair⁅1⁆ + 1
        }
    }

    let right: usize = 2 * index + 2
    if right < root.length() {
        let right_pair: ArrayList<i64> = walk(root, right, best)
        if root⁅right⁆ + 1 == value {
            if right_pair⁅0⁆ + 1 > incr {
                incr = right_pair⁅0⁆ + 1
            }
        }
        if root⁅right⁆ - 1 == value {
            if right_pair⁅1⁆ + 1 > decr {
                decr = right_pair⁅1⁆ + 1
            }
        }
    }

    let candidate: i64 = incr + decr - 1
    if candidate > best⁅0⁆ {
        best⁅0⁆ = candidate
    }
    pair.push(incr)
    pair.push(decr)
    return pair
}

[export(case: "camelCase")]
micro longest_consecutive(root: ArrayList<i64>) -> i64 {
    let mut best: ArrayList<i64> = ArrayList::new(1)
    best.push(0)
    let pair: ArrayList<i64> = walk(root, 0, best)
    return best⁅0⁆
}

class Solution {
    micro longestConsecutive(self, root: ArrayList<i64>): i64 {
        return longest_consecutive(root)
    }
}

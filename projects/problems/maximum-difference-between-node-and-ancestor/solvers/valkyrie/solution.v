namespace leetcode.maximum_difference_between_node_and_ancestor;

using std.collection;

micro absolute(value: i64) -> i64 {
    if value < 0 {
        return 0 - value
    }
    return value
}

micro lower_of(left: i64, right: i64) -> i64 {
    if left < right {
        return left
    }
    return right
}

micro higher_of(left: i64, right: i64) -> i64 {
    if left > right {
        return left
    }
    return right
}

# 自顶向下携带祖先区间极值，节点处直接更新最大差。
micro walk(root: ArrayList<i64>, index: usize, low: i64, high: i64, best: ArrayList<i64>) {
    if index >= root.length() {
        return
    }
    let value: i64 = root⁅index⁆
    let candidate: i64 = absolute(low - value)
    if candidate > best⁅0⁆ {
        best⁅0⁆ = candidate
    }
    let other: i64 = absolute(high - value)
    if other > best⁅0⁆ {
        best⁅0⁆ = other
    }
    let next_low: i64 = lower_of(low, value)
    let next_high: i64 = higher_of(high, value)
    walk(root, index * 2 + 1, next_low, next_high, best)
    walk(root, index * 2 + 2, next_low, next_high, best)
}

[export(case: "camelCase")]
micro max_ancestor_diff(root: ArrayList<i64>) -> i64 {
    let mut best: ArrayList<i64> = ArrayList::new(1)
    best.push(0)
    let start: i64 = root⁅0⁆
    walk(root, 0, start, start, best)
    return best⁅0⁆
}

class Solution {
    micro maxAncestorDiff(self, root: ArrayList<i64>): i64 {
        return max_ancestor_diff(root)
    }
}

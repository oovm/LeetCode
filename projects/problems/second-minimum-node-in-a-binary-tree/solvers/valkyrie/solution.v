namespace leetcode.second_minimum_node_in_a_binary_tree;

using std.collection;

# 堆式下标递归：根值即最小值；候选 = 子节点中大于根的最小者，子树无候选则继续下探。
micro dfs(root: ArrayList<i64>, i: usize, smallest: i64) -> i64 {
    if 2 * i + 1 >= root.length() {
        return -1
    }
    let mut candidates: ArrayList<i64> = ArrayList::new(0)
    let mut child: usize = 2 * i + 1
    while child < root.length() {
        let value: i64 = root⁅child⁆
        if value > smallest {
            candidates.push(value)
        } else {
            let deeper: i64 = dfs(root, child, smallest)
            if deeper != -1 {
                candidates.push(deeper)
            }
        }
        child = child + 1
    }
    if candidates.length() == 0 {
        return -1
    }
    let mut best: i64 = candidates⁅0⁆
    loop value in candidates {
        if value < best {
            best = value
        }
    }
    return best
}

[export(case: "camelCase")]
micro findSecondMinimumValue(root: ArrayList<i64>) -> i64 {
    if root.length() == 0 {
        return -1
    }
    return dfs(root, 0, root⁅0⁆)
}

class Solution {
    micro findSecondMinimumValue(self, root: ArrayList<i64>): i64 {
        return findSecondMinimumValue(root)
    }
}

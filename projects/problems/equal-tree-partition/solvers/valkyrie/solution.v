namespace leetcode.equal_tree_partition;

using std.collection;

# 堆式层序数组里子节点下标更大，倒序累加即可得到每棵子树的节点和。
# 只要某个非根子树的节点和等于总和一半即可切分，O(n)。
[export(case: "camelCase")]
micro check_equal_tree(root: [i64]) -> bool {
    let total_nodes: i64 = root.length() as i64
    if total_nodes == 0 {
        return false
    }
    let mut sums: ArrayList<i64> = ArrayList::new(total_nodes as usize)
    let mut index: i64 = 0
    while index < total_nodes {
        sums.push(0)
        index = index + 1
    }
    let mut total: i64 = 0
    index = total_nodes - 1
    while index >= 0 {
        let value: i64 = root⁅index as usize⁆
        sums⁅index as usize⁆ = sums⁅index as usize⁆ + value
        total = total + value
        if index > 0 {
            let parent: i64 = (index - 1) / 2
            sums⁅parent as usize⁆ = sums⁅parent as usize⁆ + sums⁅index as usize⁆
        }
        index = index - 1
    }
    if total % 2 != 0 {
        return false
    }
    let half: i64 = total / 2
    index = 1
    while index < total_nodes {
        if sums⁅index as usize⁆ == half {
            return true
        }
        index = index + 1
    }
    return false
}

class Solution {
    micro checkEqualTree(self, root: [i64]): bool {
        return check_equal_tree(root)
    }
}

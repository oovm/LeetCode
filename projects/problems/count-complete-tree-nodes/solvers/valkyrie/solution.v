namespace leetcode.count_complete_tree_nodes;

# 层序数组按堆式下标排布，没有空位占位符时数组长度就是节点数。
[export(case: "camelCase")]
micro countNodes(root: [i64]) -> i64 {
    return root.length() as i64
}

class Solution {
    micro countNodes(self, root: [i64]): i64 {
        return countNodes(root)
    }
}

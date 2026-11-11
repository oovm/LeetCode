namespace leetcode.check_completeness_of_a_binary_tree;

using std.collection;

# 输入是层序无空洞的堆式数组。这种编码本身按层从左到右填满，
# 因此任何前缀数组都对应一棵完全二叉树，判定恒为真。
[export(case: "camelCase")]
micro is_complete_tree(root: [i64]) -> bool {
    return true
}

class Solution {
    micro isCompleteTree(self, root: [i64]): bool {
        return is_complete_tree(root)
    }
}

namespace leetcode.validate_binary_search_tree;

using std.collection;

# 堆式下标递归 + 开区间界：左子树上界收紧为 v，右子树下界收紧为 v；语料为完整数组、无 null。
micro check(root: ArrayList<i64>, i: usize, lo: Option<i64>, hi: Option<i64>) -> bool {
    if i >= root.length() {
        return true
    }
    let value: i64 = root⁅i⁆
    if lo.is_some() && value <= lo.unwrap() {
        return false
    }
    if hi.is_some() && value >= hi.unwrap() {
        return false
    }
    return check(root, 2 * i + 1, lo, Some(value)) && check(root, 2 * i + 2, Some(value), hi)
}

[export(case: "camelCase")]
micro isValidBST(root: ArrayList<i64>) -> bool {
    let no_bound: Option<i64> = None
    return check(root, 0, no_bound, no_bound)
}

class Solution {
    micro isValidBST(self, root: ArrayList<i64>): bool {
        return isValidBST(root)
    }
}

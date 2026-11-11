namespace leetcode.kth_smallest_element_in_a_bst;

using std.collection;

# 堆式下标中序遍历：`seen⁅0⁆` 作计数器；第 k 个被访问的节点值即答案。
micro inorder(root: [i64], i: usize, k: i64, seen: ArrayList<i64>) -> i64 {
    if i >= root.length() {
        return -1
    }
    let left: i64 = inorder(root, 2 * i + 1, k, seen)
    if left != -1 {
        return left
    }
    seen⁅0⁆ = seen⁅0⁆ + 1
    if seen⁅0⁆ == k {
        return root⁅i⁆
    }
    return inorder(root, 2 * i + 2, k, seen)
}

[export(case: "camelCase")]
micro kthSmallest(root: [i64], k: i64) -> i64 {
    let mut seen: ArrayList<i64> = ArrayList::new(1)
    seen.push(0)
    return inorder(root, 0, k, seen)
}

class Solution {
    micro kthSmallest(self, root: [i64], k: i64): i64 {
        return kthSmallest(root, k)
    }
}

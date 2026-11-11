namespace leetcode.two_sum_iv_input_is_a_bst;

using std.collection;

# 堆式下标中序收集升序值，再双指针找两数之和。
micro inorder(root: ArrayList<i64>, i: usize, out: ArrayList<i64>) -> unit {
    if i >= root.length() {
        return
    }
    inorder(root, 2 * i + 1, out)
    out.push(root⁅i⁆)
    inorder(root, 2 * i + 2, out)
}

[export(case: "camelCase")]
micro findTarget(root: ArrayList<i64>, k: i64) -> bool {
    let mut values: ArrayList<i64> = ArrayList::new(0)
    inorder(root, 0, values)
    let mut lo: usize = 0
    let mut hi: usize = values.length() - 1
    while lo < hi {
        let sum: i64 = values⁅lo⁆ + values⁅hi⁆
        if sum == k {
            return true
        }
        if sum < k {
            lo = lo + 1
        } else {
            hi = hi - 1
        }
    }
    return false
}

class Solution {
    micro findTarget(self, root: ArrayList<i64>, k: i64): bool {
        return findTarget(root, k)
    }
}

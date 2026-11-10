namespace leetcode.find_leaves_of_binary_tree;

using std.collection;

# 堆式下标递归：返回节点高度（叶 = 0），按高度把节点塞进对应行；内层 `ArrayList::new` 显式类型避免嵌套推断。
micro node_height(root: ArrayList<i64>, i: usize, out: ArrayList<ArrayList<i64>>) -> i64 {
    if i >= root.length() {
        return -1
    }
    let left: i64 = node_height(root, 2 * i + 1, out)
    let right: i64 = node_height(root, 2 * i + 2, out)
    let mut h: i64 = left
    if right > h {
        h = right
    }
    h = h + 1
    while out.length() as i64 <= h {
        let row: ArrayList<i64> = ArrayList::new(0)
        out.push(row)
    }
    out⁅h as usize⁆.push(root⁅i⁆)
    return h
}

[export(case: "camelCase")]
micro findLeaves(root: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    node_height(root, 0, out)
    return out
}

class Solution {
    micro findLeaves(self, root: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return findLeaves(root)
    }
}

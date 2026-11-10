namespace leetcode.cousins_in_binary_tree;

using std.collection;

# 堆式下标递归记录每个值的层号与父值；层同父异即堂兄弟。
micro walk(root: ArrayList<i64>, index: usize, depth: usize, parent: i64, mut depths: HashMap<i64, i64>, mut parents: HashMap<i64, i64>) -> unit {
    if index >= root.length() {
        return
    }
    let value: i64 = root⁅index⁆
    depths.insert(value, depth as i64)
    parents.insert(value, parent)
    walk(root, 2 * index + 1, depth + 1, value, depths, parents)
    walk(root, 2 * index + 2, depth + 1, value, depths, parents)
}

[export(case: "camelCase")]
micro isCousins(root: ArrayList<i64>, x: i64, y: i64) -> bool {
    let mut depths: HashMap<i64, i64> = HashMap::new(0)
    let mut parents: HashMap<i64, i64> = HashMap::new(0)
    walk(root, 0, 0, -1, depths, parents)
    let sameDepth: bool = depths.get(x).unwrap() == depths.get(y).unwrap()
    let differentParent: bool = parents.get(x).unwrap() != parents.get(y).unwrap()
    return sameDepth && differentParent
}

class Solution {
    micro isCousins(self, root: ArrayList<i64>, x: i64, y: i64): bool {
        return isCousins(root, x, y)
    }
}

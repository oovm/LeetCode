namespace leetcode.graph_valid_tree;

using std.collection;

# 树判定：n 节点 n-1 边且连通；用并查集验证边数与根数。
micro find(x: usize, parent: ArrayList<i64>) -> usize {
    let p: usize = parent⁅x⁆ as usize
    if p != x {
        let root: usize = find(p, parent)
        parent⁅x⁆ = root as i64
        return root
    }
    return x
}

[export(case: "camelCase")]
micro validTree(n: i64, edges: ArrayList<ArrayList<i64>>) -> bool {
    if edges.length() as i64 != n - 1 {
        return false
    }
    let mut parent: ArrayList<i64> = ArrayList::new(n as usize)
    let mut i: usize = 0
    while i < n as usize {
        parent.push(i as i64)
        i = i + 1
    }
    loop edge in edges {
        let ra: usize = find(edge⁅0⁆ as usize, parent)
        let rb: usize = find(edge⁅1⁆ as usize, parent)
        if ra != rb {
            parent⁅ra⁆ = rb as i64
        }
    }
    let mut roots: i64 = 0
    i = 0
    while i < n as usize {
        if find(i, parent) == i {
            roots = roots + 1
        }
        i = i + 1
    }
    return roots == 1
}

class Solution {
    micro validTree(self, n: i64, edges: ArrayList<ArrayList<i64>>): bool {
        return validTree(n, edges)
    }
}

namespace leetcode.find_if_path_exists_in_graph;

using std.collection;

# 并查集：逐边合并，最后判断 source 与 destination 同根。
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
micro validPath(n: i64, edges: ArrayList<ArrayList<i64>>, source: i64, destination: i64) -> bool {
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
    return find(source as usize, parent) == find(destination as usize, parent)
}

class Solution {
    micro validPath(self, n: i64, edges: ArrayList<ArrayList<i64>>, source: i64, destination: i64): bool {
        return validPath(n, edges, source, destination)
    }
}
